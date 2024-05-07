from rest_framework.response import Response    
from rest_framework.decorators import api_view
from emotion.models import Users,Images
from .serializers import UserSerializer,ImagesSerializer
from rest_framework import status
from django.contrib.auth.hashers import check_password
import jwt,datetime
from django.http import JsonResponse
import base64
from emotion.models import EmotionHistory
from .serializers import EmotionHistorySerializer
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt
from urllib.parse import urlencode
import requests
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import random


# Load pre-trained InceptionResnetV1 model


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = Users.objects.get(email=email) if Users.objects.filter(email=email).exists() else None    
    
    if user:
        if check_password(password, user.password):
                
            payload = {
                'id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=48),
                'iat': datetime.datetime.utcnow()
            }
                                
            token = jwt.encode(payload, key='secret', algorithm="HS256")
            response = Response()
            response.data = {
                'jwt':token,
                'status':'success',
                'id':user.id,
                }
            return response
        else:
            return Response({'status': 'error', 'message': 'Wrong Password'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['POST'])
def signup(request):
    email = request.data.get('email')       
    try:
        user_email = Users.objects.get(email=email) 
    except:
        user_email= None
   
    if user_email is None:
        generated_otp = str(random.randint(100000, 999999))
        send_otp_email(email, generated_otp)

        # serializer = UserSerializer(data={'email': email, 'mobile': mobile, 'otp': generated_otp})        
        mutable_data = request.data.copy()
        mutable_data['otp'] = generated_otp
    
    # Pass the mutable data to the serializer
        serializer = UserSerializer(data=mutable_data)
        print(mutable_data)
        print(serializer)
        print(serializer.is_valid())
        # serializer = UserSerializer(data={'email': email, 'mobile': mobile, 'otp': generated_otp})        
        if serializer.is_valid():    
            serializer.save()
            return Response({'status': 'success', 'message': 'User Created Successfully','email':email}, status=status.HTTP_201_CREATED)
        return Response({'status': 'error', 'message': 'Failed to add data'}, status=status.HTTP_400_BAD_REQUEST)        
    else:
        if user_email is not None:
            return Response({'status': 'error', 'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'status': 'error', 'message': 'Failed to add data'}, status=status.HTTP_400_BAD_REQUEST)

def send_otp_email(receiver_email, otp):
    sender_email = "dhyanpatel20@gnu.ac.in"
    sender_password = "uwga dvjc vijf ewyq"
    # Send the OTP to the user's email using Django's send_mail function
    subject = f'Otp for verification'
    message_content = f'''
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {{
      font-family: 'Google Sans', 'Roboto', sans-serif; /* Google's fonts */
      background-color: #f6f8fa;
      margin: 0;
      padding: 0;
    }}

    .container {{
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(60,64,67,.15); /* Subtle shadow */
      color: #202124; /* Google's primary text color */
    }}

    h1 {{
      color: #1a73e8; /* Google's blue */
    }}

    p {{
      color: #5f6368; 
      line-height: 1.6;
      }}

    .otp-container {{
      background-color: #e8f0fe; /* Lighter blue for less contrast */
      color: #1a73e8; /* Same blue as header for consistency */
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
      text-align: center;
      font-size: 24px;
      display: inline-block;
      }}
  </style>
</head>
<body>

  <div class="container">
    <h1>OTP</h1>
    <p>Dear User,</p>
    <p>Your OTP for login is:</p>
    
    <div class="otp-container">
      <strong>{ otp }</strong> 
    </div>
  </div>

</body>
</html>
'''
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = "OTP For Signup Verification"

# Attach the HTML content to the email
    message.attach(MIMEText(message_content, 'html'))

# Connect to the SMTP server and send the email
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, message.as_string())


@api_view(['POST'])
def checkOtp(request,pk):
    items = Users.objects.get(id=pk)
    otp = request.data.get('otp')
    otp = str(otp)
    otp_1 = str(items.otp)
    print(otp)
    print(items.otp) 
    if otp_1 == otp:
        return Response({'status': 'success', 'message': 'User authenticated'}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'error', 'message': 'Wrong OTP'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@csrf_exempt
def photo_upload(request):
    if request.method == 'POST':
        image_data = request.data.get('image_data')

        if image_data is None:
            return JsonResponse({'error': 'Image data not found in the request.'}, status=400)

        format, imgstr = image_data.split(';base64,')
        ext = format.split('/')[-1]

        image_data_decoded = base64.b64decode(imgstr)
        image_file = ContentFile(image_data_decoded, name='temp.' + ext)
        image = Images(image_data=image_file)
        image.save()

        return JsonResponse({'message': 'Image saved successfully.'})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=400)


@api_view(['GET'])
def profile(request, pk):
    user = Users.objects.get(id=pk)
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['PUT'])
def edit_profile(request, pk):
    user = Users.objects.get(id=pk)
    email = request.data.get('email')
    phone = request.data.get('phone')
    email_user = Users.objects.filter(email=email).exclude(id=pk)
    phone_user = Users.objects.filter(phone=phone).exclude(id=pk)
    if email_user.exists():
        return Response({'status': 'error', 'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
    if phone_user.exists():
        return Response({'status': 'error', 'message': 'Phone already exists'}, status=status.HTTP_400_BAD_REQUEST)
    serializer = UserSerializer(instance=user, data=request.data,partial=True)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'message': 'Profile Updated Successfully','status':'success'}, status=200)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_history(request,pk):
    history = EmotionHistory.objects.filter(userId=pk)
    serializer = EmotionHistorySerializer(history, many=True)
    if history.exists():
        return Response(serializer.data)
    else:
        return Response({'message': 'No history found for this user.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_all_data(request):
    data = EmotionHistory.objects.all()
    serializer = EmotionHistorySerializer(data, many=True)
    if data.exists():
        return Response(serializer.data)
    else:
        return Response({'message': 'No data found.'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def get_all_user(request):
    data = Users.objects.all()
    serializer = UserSerializer(data, many=True)
    if data.exists():
        return Response(serializer.data)
    else:
        return Response({'message': 'No data found.'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
def emotion_by_id(request,pk):
    data = EmotionHistory.objects.get(id=pk)
    print(pk)
    serializer = EmotionHistorySerializer(data)
    if serializer.data is not None:
        return Response(serializer.data)
    else:
        return Response({'message': 'No data found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def get_google_login_url(request):
    # Construct the login URL
    base_url = 'https://accounts.google.com/o/oauth2/v2/auth'
    params = {
        'client_id': '1005163847995-ngh95j969boe2aivj4suvnkq0rc2ep8t.apps.googleusercontent.com',
        'redirect_uri': 'http://localhost:3000',
        'response_type': 'code',
        'scope': 'https://www.googleapis.com/auth/userinfo.profile',
        # 'client_secret': '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',
}
    login_url = f'{base_url}?{urlencode(params)}'
    
    return JsonResponse({'login_url': login_url})