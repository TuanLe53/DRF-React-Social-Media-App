# Generated by Django 4.2 on 2023-05-18 11:21

from django.db import migrations, models
import django.db.models.deletion
import shortuuidfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0001_initial"),
        ("chat", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ChatRoom",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "roomId",
                    shortuuidfield.fields.ShortUUIDField(
                        blank=True, editable=False, max_length=22
                    ),
                ),
                ("type", models.CharField(default="DM", max_length=10)),
                ("name", models.CharField(blank=True, max_length=20, null=True)),
                ("member", models.ManyToManyField(to="users.profile")),
            ],
        ),
        migrations.CreateModel(
            name="ChatMessage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("message", models.CharField(max_length=255)),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                (
                    "chat",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="chat.chatroom",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="users.profile",
                    ),
                ),
            ],
        ),
    ]
