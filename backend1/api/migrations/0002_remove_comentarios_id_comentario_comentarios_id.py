# Generated by Django 5.2 on 2025-05-31 06:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comentarios',
            name='id_comentario',
        ),
        migrations.AddField(
            model_name='comentarios',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
