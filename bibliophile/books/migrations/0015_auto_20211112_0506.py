# Generated by Django 3.0.4 on 2021-11-12 05:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0014_auto_20211028_0911'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookshelf',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='review',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]