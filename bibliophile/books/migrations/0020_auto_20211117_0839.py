# Generated by Django 3.0.4 on 2021-11-17 08:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0019_auto_20211117_0833'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookseoid',
            name='bookid',
            field=models.CharField(max_length=128, unique=True),
        ),
    ]