

var PERLIN_YWRAPB = 4;
var PERLIN_YWRAP = 1<<PERLIN_YWRAPB;
var PERLIN_ZWRAPB = 8;
var PERLIN_ZWRAP = 1<<PERLIN_ZWRAPB;
var PERLIN_SIZE = 4095;

var SINCOS_PRECISION = 0.5;
var SINCOS_LENGTH = Math.floor(360 / SINCOS_PRECISION);
var sinLUT = new Array(SINCOS_LENGTH);
var cosLUT = new Array(SINCOS_LENGTH);
var DEG_TO_RAD = Math.PI/180.0;


var perlin_PI = SINCOS_LENGTH;
perlin_PI >>= 1;

var perlin_octaves = 40; // default to medium smooth
var perlin_amp_falloff = 0.1; // 50% reduction/octave
var perlin:Array<number> = new Array(PERLIN_SIZE + 1)

var seed:number = 0;

var m = 4294967296;
      // a - 1 should be divisible by m's prime factors
var a = 1664525;
       // c and m should be co-prime
var c = 1013904223;
var z = 0;
      


class PerlinNoise3D{

  constructor(tSeed:number = 0){

    for (var i = 0; i < SINCOS_LENGTH; i++) {
      sinLUT[i] = Math.sin(i * DEG_TO_RAD * SINCOS_PRECISION);
      cosLUT[i] = Math.cos(i * DEG_TO_RAD * SINCOS_PRECISION);
    }
  
      this.setSeed(seed);
   
  }

    


  setSeed(tSeed:number){
    var m = 4294967296,
    seed =  Math.random() * m;

    perlin = new Array(PERLIN_SIZE + 1);
    for (var i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = this.rand();
    }

  }

  rand(){
    z = (a * z + c) % m;
    // return a float in [0, 1)
    // if z = m then z / m = 0 therefore (z % m) / m < 1 always
    return z / m;
  }

  
  
   noise_fsc(i:number) {
    // using cosine lookup table
    return 0.5*(1.0-cosLUT[Math.floor(i*perlin_PI)%SINCOS_LENGTH]);
  };

    get(x:number,y:number,z:number) {

      y = y || 0;
      z = z || 0;

     

      if (x<0) { x=-x; }
      if (y<0) { y=-y; }
      if (z<0) { z=-z; }

      var xi=Math.floor(x), yi=Math.floor(y), zi=Math.floor(z);
      var xf = x - xi;
      var yf = y - yi;
      var zf = z - zi;
      var rxf, ryf;

      var r=0;
      var ampl=0.5;

      var n1,n2,n3;

     

      for (var o=0; o<perlin_octaves; o++) {
        var of=xi+(yi<<PERLIN_YWRAPB)+(zi<<PERLIN_ZWRAPB);

        rxf= this.noise_fsc(xf);
        ryf= this.noise_fsc(yf);

        n1  = perlin[of&PERLIN_SIZE];
        n1 += rxf*(perlin[(of+1)&PERLIN_SIZE]-n1);
        n2  = perlin[(of+PERLIN_YWRAP)&PERLIN_SIZE];
        n2 += rxf*(perlin[(of+PERLIN_YWRAP+1)&PERLIN_SIZE]-n2);
        n1 += ryf*(n2-n1);

        of += PERLIN_ZWRAP;
        n2  = perlin[of&PERLIN_SIZE];
        n2 += rxf*(perlin[(of+1)&PERLIN_SIZE]-n2);
        n3  = perlin[(of+PERLIN_YWRAP)&PERLIN_SIZE];
        n3 += rxf*(perlin[(of+PERLIN_YWRAP+1)&PERLIN_SIZE]-n3);
        n2 += ryf*(n3-n2);

        n1 += this.noise_fsc(zf)*(n2-n1);

        r += n1*ampl;
        ampl *= perlin_amp_falloff;
        xi<<=1;
        xf*=2;
        yi<<=1;
        yf*=2;
        zi<<=1;
        zf*=2;

        if (xf>=1.0) { xi++; xf--; }
        if (yf>=1.0) { yi++; yf--; }
        if (zf>=1.0) { zi++; zf--; }
      }
      return r;
    }
    


}

export {
	PerlinNoise3D
};
