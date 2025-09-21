from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Blog


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("id", "username", "first_name", "last_name", "bio",
                    "profile_picture", "facebook", "twitter", "instagram", "linkedin")


admin.site.register(CustomUser, CustomUserAdmin)


class BlogAdmin(admin.ModelAdmin):
    list_display = ("title", "category",
                    "author", "is_draft", "created_at")


admin.site.register(Blog, BlogAdmin)
