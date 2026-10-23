// uniform-grid elastic ball collisions: for each pass, separate overlapping pairs and exchange the normal velocity component
#include <math.h>
#include <stdlib.h>
#include <string.h>
void collide(double *p, double *v, int n, double r, int passes) {
    if (n < 2) return;
    double d = 2.0 * r, d2 = d * d, cs = d * 1.01;
    double minx = p[0], miny = p[1], maxx = p[0], maxy = p[1];
    for (int i = 1; i < n; i++) { if (p[2*i] < minx) minx = p[2*i]; if (p[2*i] > maxx) maxx = p[2*i]; if (p[2*i+1] < miny) miny = p[2*i+1]; if (p[2*i+1] > maxy) maxy = p[2*i+1]; }
    int gw = (int)((maxx - minx) / cs) + 3, gh = (int)((maxy - miny) / cs) + 3;
    int *head = (int*)malloc(sizeof(int) * gw * gh), *next = (int*)malloc(sizeof(int) * n), *cxs = (int*)malloc(sizeof(int) * n), *cys = (int*)malloc(sizeof(int) * n);
    for (int pass = 0; pass < passes; pass++) {
        for (int k = 0; k < gw * gh; k++) head[k] = -1;
        for (int i = 0; i < n; i++) {
            int cx = (int)((p[2*i] - minx) / cs) + 1, cy = (int)((p[2*i+1] - miny) / cs) + 1;
            if (cx < 1) cx = 1; if (cx > gw - 2) cx = gw - 2; if (cy < 1) cy = 1; if (cy > gh - 2) cy = gh - 2;
            cxs[i] = cx; cys[i] = cy; int c = cy * gw + cx; next[i] = head[c]; head[c] = i;
        }
        for (int i = 0; i < n; i++) {
            int cx = cxs[i], cy = cys[i];
            for (int oy = -1; oy <= 1; oy++) for (int ox = -1; ox <= 1; ox++) {
                int c = (cy + oy) * gw + (cx + ox);
                for (int j = head[c]; j >= 0; j = next[j]) {
                    if (j <= i) continue;
                    double ex = p[2*j] - p[2*i], ey = p[2*j+1] - p[2*i+1], dd = ex*ex + ey*ey;
                    if (dd >= d2) continue;
                    double dist = sqrt(dd); if (dist < 1e-6) { ex = 1; ey = 0; dist = 1; }
                    double nx = ex / dist, ny = ey / dist, ov = (d - dist) * .5;
                    p[2*i] -= nx * ov; p[2*i+1] -= ny * ov; p[2*j] += nx * ov; p[2*j+1] += ny * ov;
                    double vn = (v[2*i] - v[2*j]) * nx + (v[2*i+1] - v[2*j+1]) * ny;
                    if (vn > 0) { v[2*i] -= vn * nx; v[2*i+1] -= vn * ny; v[2*j] += vn * nx; v[2*j+1] += vn * ny; }
                }
            }
        }
    }
    free(head); free(next); free(cxs); free(cys);
}
