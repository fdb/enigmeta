# Deconstructing nature algorithm.
# Based on boids code by Tom De Smedt <tomdesmedt@organisms.be>, licensed under GPL.

# For the original pseucode the algorithm is based on:
# http://www.vergenet.net/~conrad/boids/pseudocode.html

from nodebox.util import random

class Boid:
    
    def __init__(self, boids, x, y, z):
        
        self.boids = boids
        self.flock = boids
    
        self.x = 1.0 * x
        self.y = 1.0 * y
        self.z = 1.0 * z
        
        self.vx = 0
        self.vy = 0
        self.vz = 0
        self.history = []
        
        self.is_perching = False
        self._perch_t = 0
                
    def copy(self):
        
        b = Boid(self.boids, self.x, self.y, self.z)
        b.vx = self.vx
        b.vy = self.vy
        b.vz = self.vz
        b.is_perching = self.is_perching
        b._perch_t = self._perch_t
        
        return b
        
    def cohesion(self, d=100):
        
        """ Boids move towards the flock's centre of mass.
        
        The centre of mass is the average position of all boids,
        not including itself (the "perceived centre").
        
        """
        
        vx = vy = vz = 0
        for b in self.boids:
            if b != self:
                vx, vy, vz = vx+b.x, vy+b.y, vz+b.z
                
        n = len(self.boids)-1
        vx, vy, vz = vx/n, vy/n, vz/n
        
        return (vx-self.x)/d, (vy-self.y)/d, (vz-self.z)/d
                
    def separation(self, r=10):
        
        """ Boids keep a small distance from other boids.
        
        Ensures that boids don't collide into each other,
        in a smoothly accelerated motion.
        
        """
        
        vx = vy = vz = 0
        for b in self.boids:
            if b != self:
                if abs(self.x-b.x) < r: vx += (self.x-b.x)
                if abs(self.y-b.y) < r: vy += (self.y-b.y)
                if abs(self.z-b.z) < r: vz += (self.z-b.z)
                
        return vx, vy, vz
        
    def alignment(self, d=5):
        
        """ Boids match velocity with other boids.
        """
        
        vx = vy = vz = 0
        for b in self.boids:
           if b != self:
               vx, vy, vz = vx+b.vx, vy+b.vy, vz+b.vz
        
        n = len(self.boids)-1
        vx, vy, vz = vx/n, vy/n, vz/n
        
        return (vx-self.vx)/d, (vy-self.vy)/d, (vz-self.vz)/d
        
    def limit(self, max=2):
        
        """ The speed limit for a boid.
        
        Boids can momentarily go very fast,
        something that is impossible for real animals.
        
        """
        
        if abs(self.vx) > max: 
            self.vx = self.vx/abs(self.vx)*max
        if abs(self.vy) > max: 
            self.vy = self.vy/abs(self.vy)*max
        if abs(self.vz) > max: 
            self.vz = self.vz/abs(self.vz)*max
        
    def _angle(self):
        
        """ Returns the angle towards which the boid is steering.
        """
        
        from math import atan, pi, degrees
        a = degrees(atan(self.vy/self.vx)) + 360
        if self.vx < 0: a += 180

        return a
    
    angle = property(_angle)
        
    def goal(self, x, y, z, d=50.0):
        
        """ Tendency towards a particular place.
        """
        
        return (x-self.x)/d, (y-self.y)/d, (z-self.z)/d
        
class Boids(list):
    
    def __init__(self, n, x, y, w, h):
        
        for i in range(n):
            dx = random(w)
            dy = random(h)
            z = random(200)
            b = Boid(self, x+dx, y+dy, z)
            self.append(b)
            
        self.x = x
        self.y = y
        self.w = w
        self.h = h
        
        self.scattered = False
        self._scatter = 0.005
        self._scatter_t = 50
        self._scatter_i = 0
        
        self._perch = 1.0 # Lower this number to simulate diving.
        self._perch_y = _ctx.HEIGHT
        self._perch_t = lambda:25+random(50)
    
        self.has_goal = False
        self.flee = False
        self._gx = 0
        self._gy = 0
        self._gz = 0
    
    # Backwards compatibility:
    def _boids(self): return self
    boids = property(_boids)
    
    def copy(self):
        
        boids = Boids(0, self.x, self.y, self.w, self.h)
        
        boids.scattered = self.scattered
        boids._scatter = self._scatter
        boids._scatter_t = self._scatter_t
        boids._scatter_i = self._scatter_i
        
        boids._perch = self._perch
        boids._perch_y = self._perch_y
        boids._perch_t = self._perch_t
        
        boids.has_goal = self.has_goal
        boids.flee = self.flee
        boids._gx = self._gx
        boids._gy = self._gy
        boids._gz = self._gz
        
        for boid in self:
            boids.append(boid.copy())
            
        return boids

    def scatter(self, chance=0.005, frames=50):
        
        self._scatter = chance
        self._scatter_t = frames
    
    def noscatter(self):
        
        self._scatter = 0.0
    
    def perch(self, ground=None, chance=1.0, frames=lambda:25+random(50)):
        
        if ground == None:
            ground = _ctx.HEIGHT
            
        self._perch = chance
        self._perch_y = ground
        self._perch_t = frames
    
    def noperch(self):
        
        self._perch = 0.0
    
    def goal(self, x, y, z, flee=False):
        
        self.has_goal = True
        self.flee = flee
        self._gx = x
        self._gy = y
        self._gz = z
        
    def nogoal(self):
        
        self.has_goal = False
        
    def constrain(self):
        
        """ Cages the flock inside the x, y, w, h area.
        
        The actual cage is a bit larger,
        so boids don't seem to bounce of invisible walls
        (they are rather "encouraged" to stay in the area).
        
        If a boid touches the ground level,
        it may decide to perch there for a while.
        
        """
        
        dx = self.w * 0.1
        dy = self.h * 0.1 
        
        for b in self:
            
            if b.x < self.x-dx: b.vx += random(dx)
            if b.y < self.y-dy: b.vy += random(dy)
            if b.x > self.x+self.w+dx: b.vx -= random(dx)
            if b.y > self.y+self.h+dy: b.vy -= random(dy)
            if b.z < 0: b.vz += 10
            if b.z > 100: b.vz -= 10
            
            if b.y > self._perch_y and random() < self._perch:
                b.y = self._perch_y
                b.vy = -abs(b.vy) * 0.2
                b.is_perching = True
                try:
                    b._perch_t = self._perch_t()
                except:
                    b._perch_t = self._perch_t
            
    def update(self, 
               shuffled=True, 
               cohesion=50, 
               separation=0, 
               alignment=1, 
               goal=10,
               limit=0.1):
        
        """ Calculates the next motion frame for the flock.
        """
        
        # Shuffling the list of boids ensures fluid movement.
        # If you need the boids to retain their position in the list
        # each update, set the shuffled parameter to False.
        from random import shuffle
        if shuffled: shuffle(self)
        
        m1 = 1.0 # cohesion
        m2 = 1.0 # separation
        m3 = 1.0 # alignment
        m4 = 1.0 # goal
        
        # The flock scatters randomly with a Boids.scatter chance.
        # This means their cohesion (m1) is reversed,
        # and their joint alignment (m3) is dimished,
        # causing boids to oscillate in confusion.
        # Setting Boids.scatter(chance=0) ensures they never scatter.
        if not self.scattered and random() < self._scatter:
            self.scattered = True
        if self.scattered:
            m1 = -m1
            m3 *= 0.25
            self._scatter_i += 1
        if self._scatter_i >= self._scatter_t:
            self.scattered = False
            self._scatter_i = 0

        # A flock can have a goal defined with Boids.goal(x,y,z),
        # a place of interest to flock around.
        if not self.has_goal:
            m4 = 0
        if self.flee:
            m4 = -m4
        
        for b in self:
            
            # A boid that is perching will continue to do so
            # until Boid._perch_t reaches zero.
            if b.is_perching:
                if b._perch_t > 0:
                    b._perch_t -= 1
                    continue
                else:
                    b.is_perching = False
            
            vx1, vy1, vz1 = b.cohesion(cohesion)
            vx2, vy2, vz2 = b.separation(separation)
            vx3, vy3, vz3 = b.alignment(alignment)
            vx4, vy4, vz4 = b.goal(self._gx, self._gy, self._gz, goal)
            
            b.vx += m1*vx1 + m2*vx2 + m3*vx3 + m4*vx4
            b.vy += m1*vy1 + m2*vy2 + m3*vy3 + m4*vy4
            b.vz += m1*vz1 + m2*vz2 + m3*vz3 + m4*vz4
            
            b.limit(limit)
        
            b.x += b.vx
            b.y += b.vy
            b.z += b.vz
        
        self.constrain()
        
def flock(n, x, y, w, h):
    
    return Boids(n, x, y, w, h)
    
GRID = {}
GRID_SIZE = 500
GRID_SCALE = 2
size(GRID_SIZE * GRID_SCALE, GRID_SIZE * GRID_SCALE)

def mark_grid(x, y):
    ix = int(round(x))
    iy = int(round(y))
    intensity = GRID.get((ix, iy), 0)
    intensity += 1
    GRID[(ix,iy)] = intensity

    
f = flock(10, 0, 0, GRID_SIZE, GRID_SIZE)

speed(100)

def dot(x, y):
    rect(x * GRID_SCALE, y * GRID_SCALE, GRID_SCALE, GRID_SCALE)

def draw():
    nofill()
    stroke(0)
    strokewidth(0.1)
    autoclosepath(False)

    for i in range(100):
        f.update()
        f.noperch()    
        for b in f.boids:
            b.history.append((b.x, b.y))
            #mark_grid(b.x, b.y)
            
    for b in f.boids:
        x, y = b.history[0]
        beginpath(x * GRID_SCALE, y * GRID_SCALE)
        for x,y in b.history[1:]:
            lineto(x * GRID_SCALE, y * GRID_SCALE)
        endpath()

