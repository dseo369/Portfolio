For this Simulation & Game Programming project, we were tasked with creating 2 objects each with at least 8 keyframes that defined the animation.
This means that there were to be 8 points where the objects would have to move to/through smoothly, and we marked these keyframe locations/times
by adding a stationary wire object to show that the animated object was indeed smoothly passing through it, and on to the next keyframe.

I used a cube for one of my objects and a torus for my other one. I had them fly through a 3D space by transforming their XYZ coordinates, and 
and made it smooth by using a smooth interpolation technique we learned in class. Also, as the objects moved from each keyframe to the next, they also
moved in varying ways (spinning/flipping/moving slower/faster depending on the keyed time of the next keyframe) between each keyframe.
