from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from keras.models import load_model
from .serializers import EmotionHistorySerializer
from keras.preprocessing.image import img_to_array
import numpy as np
import cv2
import base64
from django.core.files.base import ContentFile
import os

# Load the pre-trained model and cascade classifier
model_path = os.path.join(os.path.dirname(__file__), 'model.h5')
classifier = load_model(model_path)
face_model = os.path.join(os.path.dirname(__file__), 'haarcascade_frontalface_default.xml')
print(face_model)
print(model_path)
# classifier = load_model('E:/IBM project/emosense-main/backend/emosense/api/model.h5')
face_classifier = cv2.CascadeClassifier(face_model)
# emotion_labels = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

@api_view(['POST'])
@csrf_exempt
def predict_emotion(request):
    if request.method == 'POST' and request.data.get('image'):
        # Get the base64 encoded image data from the request
        image_data = request.data['image']
        user_id = request.data['user_id']
        # Decode the base64 image data
        format, imgstr = image_data.split(';base64,')
        ext = format.split('/')[-1]
        image_data = ContentFile(base64.b64decode(imgstr), name=f'uploaded_image.{ext}')

        # Process the image data
        # Load the pre-trained model
        classifier = load_model(model_path)
        # classifier = load_model('E:/IBM project/emosense-main/backend/emosense/api/model.h5')
        emotion_labels = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

        # Convert image data to OpenCV format
        nparr = np.frombuffer(image_data.read(), np.uint8)
        image_cv = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Convert to grayscale
        gray = cv2.cvtColor(image_cv, cv2.COLOR_BGR2GRAY)

        # Resize image to fit the model's input shape
        resized_image = cv2.resize(gray, (48, 48), interpolation=cv2.INTER_AREA)
        resized_image = resized_image.astype('float') / 255.0
        resized_image = np.expand_dims(resized_image, axis=0)
        resized_image = np.expand_dims(resized_image, axis=3)

        # Predict emotion for the image
        prediction = classifier.predict(resized_image)
        for i in range(len(prediction[0])):
            print(emotion_labels[i], prediction[0][i])
            
        predicted_emotion_index = np.argmax(prediction)
        # keep prediction to 2 decimal places
        predicted_emotion = emotion_labels[predicted_emotion_index]
        
        
        # predicted_emotion = emotion_labels[predicted_emotion_index]
        
        #convert prediction value  0 and 1       
        # prediction = prediction[0][predicted_emotion_index] 
        
        
        data = {
            'image': request.data['image'],
            'emotion': predicted_emotion,
            'prediction': prediction.tolist(),
            'userId': user_id
        }
        serializer = EmotionHistorySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
        else:
            return JsonResponse({'error': 'Failed to save emotion data.'}, status=400)

        return JsonResponse({'emotion': predicted_emotion,'prediction': prediction.tolist()})
    else:
        return JsonResponse({'error': 'Invalid request method or no image uploaded.'}, status=400)