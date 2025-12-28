# PDF Resume Editor

A full-stack web application for editing PDF resumes with an intuitive interface. Upload a PDF resume, edit text blocks directly on the document, apply formatting changes, and download the edited version.

## 🚀 Features

### Core Features

- **PDF Upload**: Upload PDF resume files through a simple file input
- **Text Block Extraction**: Automatically extracts all text blocks from the PDF with their positions, fonts, sizes, and colors
- **Visual Editing**: Click on text blocks directly on the PDF to edit them
- **Real-time Preview**: See changes reflected in real-time as you edit
- **Text Formatting**:
  - Font selection (Helvetica, Times-Roman, Courier)
  - Font size adjustment (increase/decrease)
  - Text color customization
  - Bold and italic styling
- **PDF Regeneration**: Save edited blocks and regenerate a new PDF with all changes applied
- **Download Edited PDF**: Download the final edited PDF file

### User Interface

- **Interactive PDF Viewer**: View PDFs rendered in the browser using PDF.js
- **Overlay Editor**: Clickable overlay system for selecting text blocks
- **Edit Panel**: Side panel for editing selected text blocks with live preview
- **Toolbar Controls**: Easy access to all editing tools and formatting options
- **Edit Mode Toggle**: Switch between view and edit modes

## 🛠️ Tech Stack

### Backend

- **Framework**: Django 6.0
- **API**: Django REST Framework
- **PDF Processing**: PyMuPDF (fitz)
- **Database**: SQLite3
- **CORS**: django-cors-headers

### Frontend

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **HTTP Client**: Axios 1.13.2
- **PDF Rendering**: pdfjs-dist 5.4.449
- **Styling**: CSS (inline styles and external stylesheets)

## 📁 Project Structure

```
pdf-resume-editor/
├── Backend/
│   └── config/
│       ├── config/              # Django project settings
│       │   ├── settings.py      # Django configuration
│       │   ├── urls.py          # Main URL routing
│       │   ├── asgi.py          # ASGI configuration
│       │   └── wsgi.py          # WSGI configuration
│       ├── resumes/             # Resume app
│       │   ├── models.py        # Resume data model
│       │   ├── views.py         # API view handlers
│       │   ├── urls.py           # App URL routing
│       │   ├── serializers.py   # DRF serializers
│       │   ├── pdf_extractor.py # PDF text extraction logic
│       │   ├── pdf_regenerator.py # PDF regeneration logic
│       │   └── pdf_editor.py    # PDF editing utilities
│       ├── media/               # Uploaded files
│       │   ├── input/           # Original PDFs
│       │   └── output/          # Edited PDFs
│       ├── fonts/               # PDF font files
│       └── manage.py            # Django management script
│
└── Frontend/
    └── pdf-resume-editor/
        ├── src/
        │   ├── api/
        │   │   └── resumeApi.js      # API client functions
        │   ├── components/
        │   │   ├── PdfViewer.jsx     # PDF rendering component
        │   │   ├── PdfOverlayEditor.jsx # Overlay editor component
        │   │   └── Navbar.jsx        # Navigation component
        │   ├── Editor.jsx            # Main editor component
        │   ├── App.jsx               # Root component
        │   └── styles/
        │       └── editor.css        # Editor styles
        ├── package.json
        └── vite.config.js
```

## 📋 Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 14.x or higher
- **npm** or **yarn**: Package manager

## 🔧 Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend/config
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - **Windows**:
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. Install Python dependencies:
```bash
pip install django djangorestframework django-cors-headers PyMuPDF
```

5. Run database migrations:
```bash
python manage.py migrate
```

6. Start the Django development server:
```bash
python manage.py runserver
```

The backend API will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Frontend/pdf-resume-editor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port shown in the terminal)

## 📡 API Documentation

### Base URL
```
http://127.0.0.1:8000/api/resume/
```

### Endpoints

#### 1. Upload Resume

Upload a PDF resume file to the server.

**Endpoint**: `POST /api/resume/upload/`

**Request**:
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `resume` (file): PDF file to upload

**Response** (200 OK):
```json
{
  "resume_id": 1
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "No file provided"
}
```

---

#### 2. Extract PDF Blocks

Extract all text blocks from an uploaded PDF with their metadata.

**Endpoint**: `POST /api/resume/extract-blocks/`

**Request**:
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "resume_id": 1
}
```

**Response** (200 OK):
```json
{
  "blocks": [
    {
      "page": 0,
      "text": "John Doe",
      "bbox": [72.0, 100.0, 200.0, 120.0],
      "size": 24.0,
      "font": "Helvetica-Bold",
      "color": 0
    },
    {
      "page": 0,
      "text": "Software Engineer",
      "bbox": [72.0, 130.0, 250.0, 150.0],
      "size": 14.0,
      "font": "Helvetica",
      "color": 0
    }
  ]
}
```

**Block Object Properties**:
- `page` (integer): Page number (0-indexed)
- `text` (string): Text content of the block
- `bbox` (array): Bounding box coordinates `[x0, y0, x1, y1]`
- `size` (float): Font size
- `font` (string): Font family name
- `color` (integer): Text color value

---

#### 3. Save Edited Blocks

Save edited text blocks and regenerate the PDF with changes.

**Endpoint**: `POST /api/resume/save-edits/`

**Request**:
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "resume_id": 1,
  "blocks": [
    {
      "page": 0,
      "text": "John Doe",
      "new_text": "Jane Smith",
      "bbox": [72.0, 100.0, 200.0, 120.0],
      "size": 24.0,
      "font": "Helvetica",
      "color": "#000000",
      "bold": false,
      "italic": false
    }
  ]
}
```

**Block Object for Save**:
- All properties from extraction, plus:
- `new_text` (string): **Required** - The edited text content
- `color` (string): Hex color code (e.g., "#000000")
- `bold` (boolean): Bold formatting flag
- `italic` (boolean): Italic formatting flag

**Response** (200 OK):
```json
{
  "download_url": "http://127.0.0.1:8000/media/output/edited_abc123.pdf"
}
```

**Error Responses**:

400 Bad Request:
```json
{
  "error": "resume_id or blocks missing"
}
```

500 Internal Server Error:
```json
{
  "error": "Error message details"
}
```

---

### Media Files

Edited PDFs are served at:
```
http://127.0.0.1:8000/media/output/{filename}
```

## 🎯 Usage

### Basic Workflow

1. **Upload PDF**: Click the file input button and select a PDF resume file
2. **Extract Blocks**: The system automatically extracts all text blocks from the PDF
3. **Enter Edit Mode**: Click "Edit Text" button to enable editing
4. **Select Text Block**: Click on any text block in the PDF to select it
5. **Edit Text**: 
   - Use the side panel textarea to modify the text
   - Adjust formatting using toolbar controls (font, size, color, bold, italic)
6. **Save Changes**: Click "Save PDF" to regenerate the PDF with your edits
7. **Download**: The edited PDF URL is updated automatically for download

### Formatting Options

- **Font Selection**: Choose from Helvetica, Times-Roman, or Courier
- **Font Size**: Use A+ to increase or A- to decrease font size
- **Text Color**: Use the color picker to change text color
- **Bold/Italic**: Toggle bold (B) or italic (I) formatting

### Tips

- Only one text block can be edited at a time
- Changes are applied in real-time to the selected block
- The original PDF is preserved; edits create a new PDF file
- Formatting changes are applied when you save the PDF

## 🔒 Configuration

### Backend Settings

Key settings in `Backend/config/config/settings.py`:

- `DEBUG = True`: Enable debug mode (set to `False` in production)
- `CORS_ALLOW_ALL_ORIGINS = True`: Allow all origins (configure properly for production)
- `MEDIA_ROOT`: Directory for uploaded files
- `MEDIA_URL`: URL prefix for media files

### Frontend Configuration

API base URL in `Frontend/pdf-resume-editor/src/api/resumeApi.js`:
```javascript
const BASE_URL = "http://127.0.0.1:8000/api/resume/";
```

Update this if your backend runs on a different host/port.

## 🧪 Development

### Running in Development Mode

**Backend**:
```bash
cd Backend/config
python manage.py runserver
```

**Frontend**:
```bash
cd Frontend/pdf-resume-editor
npm run dev
```

### Building for Production

**Frontend**:
```bash
cd Frontend/pdf-resume-editor
npm run build
```

The production build will be in the `dist/` directory.

## 📝 Data Models

### Resume Model

```python
class Resume(models.Model):
    original_pdf = models.FileField(upload_to="input/")
    updated_pdf = models.FileField(upload_to="output/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

- `original_pdf`: The uploaded PDF file
- `updated_pdf`: The edited PDF file (created after saving edits)
- `created_at`: Timestamp of creation

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `django-cors-headers` is installed and `CorsMiddleware` is in `MIDDLEWARE`
2. **PDF Not Rendering**: Check that `pdfjs-dist` is properly installed
3. **File Upload Fails**: Verify `MEDIA_ROOT` directory exists and has write permissions
4. **Blocks Not Extracting**: Ensure PyMuPDF is installed correctly: `pip install PyMuPDF`




