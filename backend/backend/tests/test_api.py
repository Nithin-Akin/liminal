import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parents[1]))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def auth():
    response = client.post('/auth/login', json={'email': 'nithinios16@gmail.com', 'password': 'nithin123#'})
    assert response.status_code == 200
    return {'Authorization': f"Bearer {response.json()['session']['access_token']}"}

def test_requires_authentication():
    assert client.get('/checkins/history').status_code == 401

def test_invalid_source_url():
    assert client.post('/sources/verify', headers=auth(), json={'url': 'not-a-url'}).status_code == 422

def test_user_isolation():
    headers = auth()
    assert client.get('/dashboard/someone-else', headers=headers).status_code == 403

def test_source_confirmation():
    response = client.post('/sources/confirm', headers=auth(), json={'url': 'https://example.com', 'category': 'housing', 'facts': {'rent': '₹12000'}, 'confidence': 'low'})
    assert response.status_code == 200
    assert response.json()['saved'] is True
