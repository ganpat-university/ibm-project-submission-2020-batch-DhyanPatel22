from django.urls import path
from . import views
from . import Modelview

urlpatterns = [
    path('api/signup/',views.signup),
    path('api/login/',views.login),
    path('api/login/google',views.get_google_login_url),
    path('api/photo/',views.photo_upload),
    path('api/profile/<int:pk>',views.profile),
    path('api/model/',Modelview.predict_emotion),
    path('api/editProfile/<int:pk>',views.edit_profile),
    path('api/emotionHistory/<int:pk>',views.get_history),
    path('api/emotion/all',views.get_all_data),
    path('api/emotion/<int:pk>',views.emotion_by_id),
    path('api/user/all',views.get_all_user),
    path('api/checkOtp/<int:pk>',views.checkOtp),
    
    
]


