from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base_ementario", "0003_alter_curriculodisciplina_tipo_disciplina"),
    ]

    operations = [
        migrations.AlterField(
            model_name="curriculo",
            name="versao",
            field=models.CharField(max_length=120),
        ),
        migrations.AlterField(
            model_name="disciplina",
            name="codigo_disciplina",
            field=models.CharField(max_length=120, unique=True),
        ),
    ]
