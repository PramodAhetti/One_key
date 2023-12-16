const app = require('./socket-server.js').app;
const io = require('./socket-server.js').io;
const server = require('./socket-server.js').server;
const robot = require('robotjs');
const path = require('path');

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/control', (req, res) => {
    res.sendFile(path.join(__dirname, "controller.html"));
});

io.on('connection', user => {
    console.log("user connected");

    user.on('trackpadMove', (data) => {
        // Extract x and y coordinates from the data
        const { x, y } = data;

        // Move the cursor based on trackpad data
        robot.moveMouse(x, y);
      });
    
  // Listen for mouse click events
     user.on('mouseDown', (data) => {
        // Extract the button from the data
        const { button } = data;
    
        // Perform a mouse down action based on the button
        robot.mouseToggle('down', button);
      });
    
      user.on('mouseUp', (data) => {
        // Extract the button from the data
        const { button } = data;
    
        // Perform a mouse up action based on the button
        robot.mouseToggle('up', button);
      });


    user.on('keyUp', (data) => {
        if (data === 'Control') {
            robot.keyToggle('control', 'up');
            console.log('Control key released');
        } else if (data === 'Meta') {
            robot.keyToggle('command', 'up');
            console.log('Command (Meta) key released');
        }
    });

    user.on('keyDown', (data) => {
        if (data === 'Control') {
            robot.keyToggle('control', 'down');
            console.log('Control key pressed');
        } else if (data === 'Meta') {
            robot.keyToggle('command', 'down');
            console.log('Command (Meta) key pressed');
        } else if (data === 'Shift') {
            console.log('Shift key pressed');
        } else if (data === 'Tab') {
            robot.keyTap('tab');
        } else {
            if (data.length >=5) {
                
                
                console.log(data);

                switch (data) {
                    case 'Enter':
                        robot.keyTap('enter')
                    case 'ArrowUp':
                        robot.keyTap('up');
                        break;
                    case 'ArrowDown':
                        robot.keyTap('down');
                        break;
                    case 'ArrowRight':
                        robot.keyTap('right');
                        break;
                    case 'ArrowLeft':
                        robot.keyTap('left');
                        break;
                    case 'Backspace':
                        robot.keyTap('backspace');
                        break;
                    default:
                        // Handle other cases
                }
            } else { 
                robot.keyTap(data);
            }
        }
    });
});

server.listen(9000, () => {
    console.log("Server started");
});
