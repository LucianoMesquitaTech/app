from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=100)
    sobrenome = models.CharField(max_length=100)
    endereco = models.CharField(max_length=255)
    numero = models.CharField(max_length=10)
    telefone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    sexo = models.CharField(max_length=10)
    data_nascimento = models.DateField()
    usuario = models.CharField(max_length=50, unique=True)
    senha = models.CharField(max_length=255)  # Recomendado: criptografar depois

    def __str__(self):
        return self.usuario


class Medicao(models.Model):
    temperatura = models.FloatField()
    umidade = models.FloatField()
    data_hora = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.data_hora:%d/%m/%Y %H:%M:%S} → {self.temperatura:.1f}°C / {self.umidade:.1f}%"