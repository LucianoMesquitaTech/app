from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
from .models import Usuario  # ← seu modelo de banco
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Medicao
from django.contrib.auth import logout
from django.utils.timezone import localtime
import json


# Create your views here.
def login(request):
    if request.method == 'POST':
        usuario = request.POST.get('usuario')
        senha = request.POST.get('senha')

        try:
            conta = Usuario.objects.get(usuario=usuario)

            if conta.senha == senha:
                request.session['usuario_id'] = conta.id  # ✅ salva o ID na sessão
                messages.success(request, f'👋 Bem-vindo de volta, {conta.nome}!')
                return redirect('dashboard')
            else:
                messages.error(request, '❌ Senha incorreta.')

        except Usuario.DoesNotExist:
            messages.error(request, '❌ Usuário não encontrado.')

        return render(request, 'login.html')

    return render(request, 'login.html')




def cadastro(request):
    
    if request.method == 'POST':
        dados = request.POST
        senha = dados.get('senha')
        confirmar = dados.get('confirmar_senha')

        if senha != confirmar:
            messages.error(request, '⚠️ As senhas não coincidem.')
            return render(request, 'cadastro.html')

        if Usuario.objects.filter(usuario=dados.get('usuario')).exists():
            messages.error(request, '⚠️ Nome de usuário já está em uso.')
            return render(request, 'cadastro.html')

        if Usuario.objects.filter(email=dados.get('email')).exists():
            messages.error(request, '⚠️ E-mail já cadastrado.')
            return render(request, 'cadastro.html')

        try:
            Usuario.objects.create(
                nome=dados.get('nome'),
                sobrenome=dados.get('sobrenome'),
                endereco=dados.get('endereco'),
                numero=dados.get('numero'),
                telefone=dados.get('telefone'),
                email=dados.get('email'),
                sexo=dados.get('sexo'),
                data_nascimento=dados.get('data_nascimento'),
                usuario=dados.get('usuario'),
                senha=senha
            )
            messages.success(request, '✅ Cadastro realizado com sucesso!')
            return render(request, 'cadastro.html')

        except Exception as e:
            print("❌ Erro no cadastro:", e)
            messages.error(request, '❌ Ocorreu um erro ao salvar os dados. Tente novamente.')
            return render(request, 'cadastro.html')

    return render(request, 'cadastro.html') 

# views.py
from .models import Medicao
from django.shortcuts import render

def dashboard(request):
    # Pega todas as medições, ordenadas pela data
    medicoes = Medicao.objects.all().order_by('data_hora')

    # Gera listas para os gráficos
    labels = [m.data_hora.strftime('%d/%m %H:%M') for m in medicoes]
    temperaturas = [m.temperatura for m in medicoes]
    umidades = [m.umidade for m in medicoes]

    context = {
        'labels': labels,
        'temperaturas': temperaturas,
        'umidades': umidades,
        'ultima': medicoes.last(),
        'usuario_nome': request.user.first_name or request.user.username,
    }
    return render(request, 'power_vision/dashboard.html', context)

@csrf_exempt
def receber_dados(request):
    if request.method == 'POST':
        temperatura = request.POST.get('temperatura')
        umidade = request.POST.get('umidade')

        if temperatura and umidade:
            try:
                Medicao.objects.create(
                    temperatura=float(temperatura),
                    umidade=float(umidade)
                )
                return JsonResponse({'status': 'ok'})
            except Exception as e:
                print("❌ Erro ao salvar:", e)
                return JsonResponse({'erro': 'Falha ao salvar'}, status=500)
        return JsonResponse({'erro': 'Dados incompletos'}, status=400)
    return JsonResponse({'erro': 'Método não permitido'}, status=405)

def dashboard(request):
    medicoes = Medicao.objects.order_by('-data_hora')[:500]
    ultima = medicoes[0] if medicoes else None

    labels = [localtime(m.data_hora).strftime('%H:%M') for m in medicoes]
    temperaturas = [float(m.temperatura) for m in medicoes]
    umidades = [float(m.umidade) for m in medicoes]

    nome = "Usuário"
    usuario_id = request.session.get("usuario_id")
    if usuario_id:
        try:
            conta = Usuario.objects.get(id=usuario_id)
            nome = conta.nome
        except Usuario.DoesNotExist:
            pass

    context = {
        "usuario_nome": nome,
        "medicoes": medicoes,
        "ultima": ultima,
        "labels": labels,
        "temperaturas": temperaturas,
        "umidades": umidades
    }

    return render(request, "dashboard.html", context)


def sair(request):
    logout(request)
    return redirect('login')



@csrf_exempt
def receber_dados(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            temperatura = data.get("temperatura")
            umidade = data.get("umidade")

            Medicao.objects.create(
                temperatura=temperatura,
                umidade=umidade
            )

            print(f"Salvo: {temperatura}°C | {umidade}%")
            return JsonResponse({"status": "ok"})
        except Exception as e:
            print("Erro:", e)
            return JsonResponse({"status": "erro"})
    return JsonResponse({"status": "invalido"})
                                                                                         