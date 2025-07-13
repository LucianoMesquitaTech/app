from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('cadastro/', views.cadastro, name='cadastro'),
    path('receber_dados/', views.receber_dados, name='receber_dados'),
    path('logout/', views.sair, name='logout'),
    
]