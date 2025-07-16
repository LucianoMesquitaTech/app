from django.contrib import admin
from django.contrib import admin
from .models import Usuario, Medicao  # substitua pelos seus modelos



# Register your models here.
from django.contrib import admin
from .models import Usuario, Medicao

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'email', 'telefone', 'sexo', 'data_nascimento')
    search_fields = ['usuario', 'email']
    list_filter = ['sexo']

@admin.register(Medicao)
class MedicaoAdmin(admin.ModelAdmin):
    list_display = ('data_hora', 'temperatura', 'umidade')
    list_filter = ['data_hora']
    ordering = ['-data_hora']