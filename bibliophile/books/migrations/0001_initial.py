# Generated by Django 3.2.8 on 2021-10-25 12:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=250)),
                ('author', models.CharField(max_length=250)),
                ('publisher', models.CharField(max_length=250)),
                ('description', models.TextField()),
                ('page_count', models.IntegerField()),
                ('category', models.CharField(max_length=250)),
                ('image_link_small', models.CharField(max_length=1000)),
                ('image_link_large', models.CharField(max_length=1000)),
                ('language', models.CharField(max_length=100)),
                ('preview_link', models.CharField(max_length=1000)),
                ('search_info', models.CharField(blank=True, max_length=250)),
            ],
            options={
                'verbose_name': 'Book',
                'verbose_name_plural': 'Books',
                'db_table': 'book',
            },
        ),
        migrations.CreateModel(
            name='BookSelf',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('book_in_self', models.CharField(choices=[('RL', 'Readlist'), ('WL', 'Wishlist'), ('SL', 'Selflist')], default='RL', max_length=2)),
                ('book_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='books.book')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Book Self',
                'verbose_name_plural': 'Book Self',
                'db_table': 'book_self',
            },
        ),
    ]