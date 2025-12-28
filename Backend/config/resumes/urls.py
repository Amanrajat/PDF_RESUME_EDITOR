from django.urls import path
from .views import ExtractBlocksView, SaveEditedBlocksView , ResumeUploadView

urlpatterns = [
     path("upload/", ResumeUploadView.as_view(), name="resume-upload"),
    path("extract-blocks/", ExtractBlocksView.as_view()),
    path("save-edits/", SaveEditedBlocksView.as_view()),
]
