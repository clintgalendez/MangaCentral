import requests
import os
from django.contrib.auth.models import AnonymousUser
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

class SimpleAuthenticatedUser:
    def __init__(self, user_id):
        self.id = user_id
        self.is_authenticated = True
        self.is_staff = False
        self.is_superuser = False

    def __str__(self):
        return f"User_{self.id}"

    def get_username(self):
        return str(self.id)


class UserServiceTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header or not auth_header.lower().startswith('token '):
            return None  # No token provided, authentication will fail or be handled by other classes

        token = auth_header.split(' ')[1]

        user_service_url = os.environ.get('USER_SERVICE_VALIDATE_TOKEN_URL')
        if not user_service_url:
            print("CRITICAL: USER_SERVICE_VALIDATE_TOKEN_URL is not configured.")
            raise AuthenticationFailed('User service URL not configured. Authentication cannot proceed.')

        try:
            # This endpoint in user_service should be protected and return user details if token is valid
            response = requests.get(
                user_service_url,
                headers={'Authorization': f'Token {token}'},
                timeout=5
            )
            response.raise_for_status()  # Raises HTTPError for bad responses (4xx or 5xx)
            user_data = response.json()

            if 'id' in user_data:
                # Successfully authenticated with user_service
                return (SimpleAuthenticatedUser(user_data['id']), token)
            else:
                raise AuthenticationFailed('Invalid user data format from user service.')

        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 401 or e.response.status_code == 403:
                # Token is invalid or expired according to user_service
                raise AuthenticationFailed('Invalid or expired token.')
            else:
                # Other HTTP error from user_service
                print(f"HTTP error when validating token with user service: {e}")
                raise AuthenticationFailed('Error validating token with user service.')
        except requests.exceptions.RequestException as e:
            # Network error, timeout, etc.
            print(f"Could not connect to user service: {e}")
            raise AuthenticationFailed('Could not connect to user service for token validation.')
        except ValueError:  # Includes JSONDecodeError
            print("Invalid JSON response from user service.")
            raise AuthenticationFailed('Invalid response from user service.')

    def authenticate_header(self, request):
        # Used to populate the WWW-Authenticate header for 401 Unauthorized responses
        return 'Token realm="api"'