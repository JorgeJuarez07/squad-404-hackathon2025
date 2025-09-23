from django.urls import path
from .views import ConversationListView, MessageCreateView

urlpatterns = [
    path('conversations/', ConversationListView.as_view(), name='conversation_list'),
    path('conversations/<int:pk>/messages/', MessageCreateView.as_view(), name='message_create'),
]