from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from .models import Resume
from rest_framework import status
from .pdf_extractor import extract_pdf_blocks
from .pdf_regenerator import regenerate_pdf
from .pdf_editor import edit_resume
import os
import uuid


class ExtractBlocksView(APIView):
    def post(self, request):
        resume = Resume.objects.get(id=request.data["resume_id"])
        blocks = extract_pdf_blocks(resume.original_pdf.path)
        return Response({"blocks": blocks})
class ResumeUploadView(APIView):
    def post(self, request):
        pdf = request.FILES.get("resume")

        if not pdf:
            return Response(
                {"error": "No file provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        resume = Resume.objects.create(original_pdf=pdf)

        return Response({
            "resume_id": resume.id,
        })

class SaveEditedBlocksView(APIView):
    def post(self, request):
        try:
            resume_id = request.data.get("resume_id")
            blocks = request.data.get("blocks")

            if not resume_id or not blocks:
                return Response(
                    {"error": "resume_id or blocks missing"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            resume = Resume.objects.get(id=resume_id)

            
            filename = f"edited_{uuid.uuid4().hex}.pdf"
            output_path = os.path.join("media", "output", filename)

           
            regenerate_pdf(
                resume.original_pdf.path,
                output_path,
                blocks
            )

          
            resume.updated_pdf.name = f"output/{filename}"
            resume.save()

            return JsonResponse({
                "download_url": request.build_absolute_uri(resume.updated_pdf.url)
            }, status=200)

        except Exception as e:
            print(" SAVE ERROR:", str(e))
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

