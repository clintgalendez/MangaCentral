# Generated by Django 4.2.23 on 2025-06-13 01:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_bookmark', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='supportedsite',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
