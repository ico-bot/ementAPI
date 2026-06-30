from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base_ementario", "0001_initial"),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="curriculo",
            unique_together={("curso", "versao")},
        ),
        migrations.AlterField(
            model_name="curriculo",
            name="ano_inicio",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="curriculo",
            name="semestre_inicio",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="docentedisciplina",
            name="ano",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="docentedisciplina",
            name="semestre",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
