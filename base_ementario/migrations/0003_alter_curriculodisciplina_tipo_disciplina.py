from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base_ementario", "0002_curriculo_sem_ano_semestre_obrigatorio"),
    ]

    operations = [
        migrations.AlterField(
            model_name="curriculodisciplina",
            name="tipo_disciplina",
            field=models.CharField(
                choices=[
                    ("ObrigatÃ³ria", "ObrigatÃ³ria"),
                    ("Optativa", "Optativa"),
                    ("Eletiva", "Eletiva"),
                    ("Atividades Complementares de PG", "Atividades Complementares de PG"),
                ],
                default="ObrigatÃ³ria",
                max_length=50,
            ),
        ),
    ]
