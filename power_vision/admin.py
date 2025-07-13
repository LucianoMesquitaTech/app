from django.contrib import admin
from django.contrib import admin
from .models import Sensor, Leitura  # substitua pelos seus modelos

admin.site.register(Sensor)
admin.site.register(Leitura)

# Register your models here.
