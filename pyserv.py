from flask import Flask, render_template
from flask_socketio import SocketIO
import pyautogui
import os

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/control')
def control():
    return render_template('controller.html')

@socketio.on('connect')
def handle_connect():
    print("User connected")

@socketio.on('trackpadMove')
def handle_trackpad_move(data):
    x, y = data['x'], data['y']
    pyautogui.moveTo(x, y)

@socketio.on('mouseDown')
def handle_mouse_down(data):
    button = data['button']
    pyautogui.mouseDown(button=button)

@socketio.on('mouseUp')
def handle_mouse_up(data):
    button = data['button']
    pyautogui.mouseUp(button=button)

@socketio.on('keyUp')
def handle_key_up(data):
    if data == 'Control':
        pyautogui.keyUp('ctrl')
        print('Control key released')
    elif data == 'Meta':
        pyautogui.keyUp('command')
        print('Command (Meta) key released')

@socketio.on('keyDown')
def handle_key_down(data):
    if data == 'Control':
        pyautogui.keyDown('ctrl')
        print('Control key pressed')
    elif data == 'Meta':
        pyautogui.keyDown('command')
        print('Command (Meta) key pressed')
    elif data == 'Shift':
        print('Shift key pressed')
    elif data == 'Tab':
        pyautogui.press('tab')
    else:
        if len(data) >= 5:
            print(data)
            # Map keys to corresponding functions
            key_actions = {
                'Enter': pyautogui.press('enter'),
                'ArrowUp': pyautogui.press('up'),
                'ArrowDown': pyautogui.press('down'),
                'ArrowRight': pyautogui.press('right'),
                'ArrowLeft': pyautogui.press('left'),
                'Backspace': pyautogui.press('backspace')
                # Add more key mappings as needed
            }
            key_actions.get(data, pyautogui.press(data))
        else:
            pyautogui.press(data)

if __name__ == '__main__':
    socketio.run(app,host='0.0.0.0' ,port=9000)
