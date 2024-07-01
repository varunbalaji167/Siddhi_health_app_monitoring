# Generated by Django 5.0.3 on 2024-07-01 10:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_remove_patient_medconditions'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patient',
            name='medication',
        ),
        migrations.AddField(
            model_name='patientrecords',
            name='medication',
            field=models.CharField(max_length=1000, null=True),
        ),
    ]