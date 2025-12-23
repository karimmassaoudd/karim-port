"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
};

export default function SoftNoiseWebGL({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let raf = 0;
    let stopped = false;

    (async () => {
      try {
        const OGL: any = await import("ogl");
        if (!canvasRef.current) return;

        const { Renderer, Geometry, Program, Mesh } = OGL;
        const renderer = new Renderer({
          canvas: canvasRef.current,
          alpha: true,
          antialias: true,
          dpr: Math.min(window.devicePixelRatio || 1, 2),
        });
        const gl = renderer.gl;

        const vertex = `
          attribute vec2 position;
          varying vec2 vUv;
          void main(){
            vUv = (position + 1.0) * 0.5;
            gl_Position = vec4(position, 1.0, 1.0);
          }
        `;

        const fragment = `
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2 uRes;

          float hash(vec2 p){
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }
          float noise(in vec2 p){
            vec2 i = floor(p);
            vec2 f = fract(p);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
          }

          void main(){
            vec2 uv = vUv;
            float t = uTime * 0.05;
            // Soft vertical gradient + animated noise
            float n = noise(uv * 8.0 + t) * 0.15;
            vec3 top = vec3(0.06, 0.14, 0.25);
            vec3 bottom = vec3(0.03, 0.09, 0.18);
            vec3 col = mix(top, bottom, uv.y) + n;
            gl_FragColor = vec4(col, 0.55);
          }
        `;

        const geometry = new Geometry(gl, {
          position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
        });
        const program = new Program(gl, {
          vertex,
          fragment,
          uniforms: {
            uTime: { value: 0 },
            uRes: { value: [0, 0] },
          },
          transparent: true,
          depthTest: false,
        });
        const mesh = new Mesh(gl, { geometry, program });

        function resize() {
          if (!canvasRef.current) return;
          const parent = canvasRef.current.parentElement as HTMLElement;
          if (!parent) return;
          const w = parent.clientWidth;
          const h = parent.clientHeight;
          renderer.setSize(w, h);
          program.uniforms.uRes.value = [w, h];
        }

        const ro = new ResizeObserver(resize);
        if (canvasRef.current?.parentElement)
          ro.observe(canvasRef.current.parentElement);
        resize();

        const start = performance.now();
        function update() {
          if (stopped) return;
          program.uniforms.uTime.value = (performance.now() - start) / 1000;
          renderer.render({ scene: mesh });
          raf = requestAnimationFrame(update);
        }
        update();

        return () => {
          stopped = true;
          cancelAnimationFrame(raf);
          ro.disconnect();
        };
      } catch (_e) {
        // Fail silently if WebGL not available
      }
    })();

    return () => {
      stopped = true;
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
