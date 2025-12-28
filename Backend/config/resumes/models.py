from django.db import models

class Resume(models.Model):
    original_pdf = models.FileField(upload_to="input/")
    updated_pdf = models.FileField(upload_to="output/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resume {self.id}"
