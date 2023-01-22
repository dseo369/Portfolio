For this Graphics project, I decided to make a Sun, Earth, Moon system that contained 3 planetary objects with their own rotations and orbits, and
used OpenGL to create the graphics and animations. The sun is placed at the center ( 0., 0., 0. ) and also acts as the light source for the animation. 
I had to use GL_REPLACE instead of GL_MODULATE on the sun’s object in order to actually have the sun illuminated as well, and I’ve implemented it 
as a point light to emit light in all directions, which we’ve covered in a previous project. 

One of the major things I struggled with was getting the orbits and individual rotations to work properly. For the majority of the project, 
I had a hard time getting the earth to rotate about its own axis while it orbited the sun. I was able to solve this by placing a glRotatef() 
function before AND after the glTranslatef() function, and by creating the earth’s model within the sun’s glPushMatrix() function. This way, I was able 
to have the earth orbit the sun’s axis while rotating about its own. Once I figured this out, I was able to apply the same idea to the moon’s orbit and 
rotation.

Another major thing I struggled with was figuring out proper placements for the gluLookAt() functions. Though I was able to place them near where
I wanted, it wasn’t technically right as they did not rotate and orbit as needed. After considering what I had done to get the earth/moon’s orbits to 
work, I implemented the same concept to the camera by adding glRotatef() functions before and after the gluLookAt() functions. This caused it to move 
correctly based on where it was.

Although it wasn't part of the project description, I decided to add a 4th planetary object in the distance, which I wrapped in a .bmp texture file
that makes it look like the Death Star. Also, I added a giant sphere object around the environment and wrapped it in a texture that makes it look like
the viewer is in space.

There are various options the user can mess around with, and the ones that were most difficult to implement were the varying viewing locations. 
The user has the option to view the system from a spot in space, on the earth, on the moon, on the sun, and on the Death Star.
