from django.shortcuts import render
from .models import Blog
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer, BlogSerializer, UpdateUserProfileSerializer, UserInfoSerializer
import os

class BlogListPagination(PageNumberPagination):
    page_size = 6  # Number of results per page


@api_view(['GET'])
def blog_list(request):
    blogs = Blog.objects.all()
    paginator = BlogListPagination()
    paginated_blogs = paginator.paginate_queryset(blogs, request)
    serializer = BlogSerializer(paginated_blogs, many=True)
    return paginator.get_paginated_response(serializer.data)


# @api_view(['GET'])
# def blog_list(request):
#     blogs = Blog.objects.all()
#     serializer = BlogSerializer(blogs, many=True)
#     return Response(serializer.data)


@api_view(['GET'])
def get_blog(request, slug):
    blog = Blog.objects.get(slug=slug)
    serializer = BlogSerializer(blog)
    return Response(serializer.data)


@api_view(['POST'])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user

    # Сохраняем путь к старому файлу профиля
    old_profile_path = user.profile_picture.path if user.profile_picture else None

    serializer = UpdateUserProfileSerializer(user, data=request.data)
    if serializer.is_valid():
        # Проверяем, изменилось ли изображение профиля
        new_profile_image = request.FILES.get('profile_picture')

        serializer.save()

        # Удаляем старое изображение профиля только если загружено новое
        if new_profile_image and old_profile_path and os.path.exists(old_profile_path):
            try:
                os.remove(old_profile_path)
            except OSError:
                pass  # Игнорируем ошибки удаления файла
                
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_blog(request):
    user = request.user

    serializer = BlogSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=user)
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_blog(request, pk):
    user = request.user
    blog = Blog.objects.get(pk=pk)
    
    if blog.author != user:
        return Response({"error": "You are not the author of this blog"}, status=403)
    
    # Сохраняем путь к старому файлу
    old_image_path = blog.featured_image.path if blog.featured_image else None
    
    serializer = BlogSerializer(blog, data=request.data)
    if serializer.is_valid():
        # Проверяем, изменилось ли изображение
        new_image = request.FILES.get('featured_image')

        serializer.save()

        # Удаляем старое изображение только если загружено новое
        if new_image and old_image_path and os.path.exists(old_image_path):
            try:
                os.remove(old_image_path)
            except OSError:
                pass  # Игнорируем ошибки удаления файла

        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_blog(request, pk):
    user = request.user
    blog = Blog.objects.get(id=pk)
    if blog.author != user:
        return Response({"error": "You are not the author of this blog"}, status=403)
    blog.delete()
    return Response({"message": "Blog deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_username(request):
    user = request.user
    username = user.username
    return Response({"username": username})


@api_view(['GET'])
def get_userinfo(request, username):
    User = get_user_model()
    user = User.objects.get(username=username)
    serializer = UserInfoSerializer(user)
    return Response(serializer.data)


@api_view(["GET"])
def get_user(request, email):
    User = get_user_model()
    try:
        existing_user = User.objects.get(email=email)
        serializer = SimpleAuthorSerializer(existing_user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
