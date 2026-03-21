"""
LocalClaw logo renderer v2 — PIL/Pillow
Clean unified polygon strokes: no artifact banding.

Produces:
  localclaw-icon.png   — 800x800 square icon
  localclaw-lockup.png — horizontal lockup with wordmark
"""

import math
import os
from PIL import Image, ImageDraw, ImageFont

# ── Brand tokens ──────────────────────────────────────────────────────────────
BG       = (8,   7,   4)
GOLD     = (201, 146, 42)
CREAM    = (245, 238, 216)
GOLD_DIM = (150, 106, 28)

FONT_DIR = (
    "/Users/andromeda/Library/Application Support/Claude/"
    "local-agent-mode-sessions/skills-plugin/"
    "2a8dcb3b-aca2-487a-bea1-860454adf21c/"
    "3556573f-5e3a-40b4-a9ab-c0cae696d422/"
    "skills/canvas-design/canvas-fonts/"
)

OUT_DIR = os.path.dirname(os.path.abspath(__file__))

SUPERSCALE = 4   # render at 4× then downsample for anti-aliasing


# ── Geometry helpers ──────────────────────────────────────────────────────────

def bezier_pts(p0, p1, p2, steps=120):
    """Quadratic Bézier samples."""
    pts = []
    for i in range(steps + 1):
        t = i / steps
        x = (1-t)**2*p0[0] + 2*(1-t)*t*p1[0] + t**2*p2[0]
        y = (1-t)**2*p0[1] + 2*(1-t)*t*p1[1] + t**2*p2[1]
        pts.append((x, y))
    return pts


def offset_curve(pts, w_start, w_end, side=+1):
    """
    Offset a polyline to one side by a linearly-interpolated width.
    side = +1 or -1.
    Returns list of (x,y).
    """
    out = []
    n = len(pts)
    for i, (x, y) in enumerate(pts):
        t = i / (n - 1)
        w = w_start + (w_end - w_start) * t
        # tangent
        if i == 0:
            dx, dy = pts[1][0]-pts[0][0], pts[1][1]-pts[0][1]
        elif i == n - 1:
            dx, dy = pts[-1][0]-pts[-2][0], pts[-1][1]-pts[-2][1]
        else:
            dx, dy = pts[i+1][0]-pts[i-1][0], pts[i+1][1]-pts[i-1][1]
        length = math.hypot(dx, dy)
        if length == 0:
            out.append((x, y))
            continue
        # perpendicular unit vector
        nx, ny = -dy/length, dx/length
        out.append((x + side*nx*w/2, y + side*ny*w/2))
    return out


def stroke_polygon(p0, p_ctrl, p_end, w_base, w_tip, steps=120):
    """
    Build a clean closed polygon for a tapered curved stroke.
    Left side (offset +1) goes forward, right side (offset -1) comes back.
    """
    spine = bezier_pts(p0, p_ctrl, p_end, steps)
    left  = offset_curve(spine, w_base, w_tip,  +1)
    right = offset_curve(spine, w_base, w_tip,  -1)
    # Polygon: left forward + right backward
    return left + list(reversed(right))


def draw_ring(draw, cx, cy, r, thickness, color):
    """Draw a circle ring using two filled ellipses."""
    ro = r + thickness / 2
    ri = r - thickness / 2
    draw.ellipse([(cx-ro, cy-ro), (cx+ro, cy+ro)], fill=color)
    draw.ellipse([(cx-ri, cy-ri), (cx+ri, cy+ri)], fill=BG)


# ── Icon renderer ─────────────────────────────────────────────────────────────

def render_icon_hires(size):
    """Render at full resolution (size×size). Call with size*SUPERSCALE."""
    img  = Image.new("RGB", (size, size), BG)
    draw = ImageDraw.Draw(img)

    cx = size / 2
    cy = size / 2

    # ── Containment ring ──────────────────────────────────────────────────────
    ring_r     = size * 0.415
    ring_thick = size * 0.010
    draw_ring(draw, cx, cy, ring_r, ring_thick, GOLD_DIM)

    # ── Claw origin — sits at optical centre (slightly below true centre) ─────
    ox = cx
    oy = cy + size * 0.065   # push origin down so claw fills ring vertically

    # Stroke parameters
    base_w = size * 0.070   # root width — slim enough so bases don't blob
    tip_w  = size * 0.003   # tip width (razor)
    tip_r  = size * 0.375   # reach — almost to the ring edge

    def polar(angle_deg, r, from_x=ox, from_y=oy):
        a = math.radians(angle_deg)
        return (from_x + math.cos(a) * r,
                from_y - math.sin(a) * r)   # y flipped (screen coords)

    # Three strokes: left, centre, right
    # Wider spread fills the ring more confidently
    stroke_defs = [
        # left stroke — upper-left, curves inward
        dict(tip_angle=132, ctrl_lat=+0.20, ctrl_along=0.55),
        # centre stroke — straight up, very slight lean
        dict(tip_angle=90,  ctrl_lat=-0.06, ctrl_along=0.52),
        # right stroke — upper-right, curves inward
        dict(tip_angle=48,  ctrl_lat=-0.20, ctrl_along=0.55),
    ]

    for sd in stroke_defs:
        # Tip
        tip = polar(sd['tip_angle'], tip_r)

        # Midpoint of the straight line base→tip
        mid_x = (ox + tip[0]) / 2
        mid_y = (oy + tip[1]) / 2

        # Perpendicular to the base→tip direction
        dx = tip[0] - ox
        dy = tip[1] - oy
        L  = math.hypot(dx, dy)
        px, py = -dy/L, dx/L   # perpendicular unit

        # Control point
        ctrl = (
            mid_x + px * sd['ctrl_lat'] * tip_r
                  + (dx/L) * (sd['ctrl_along'] - 0.5) * tip_r,
            mid_y + py * sd['ctrl_lat'] * tip_r
                  + (dy/L) * (sd['ctrl_along'] - 0.5) * tip_r,
        )

        poly = stroke_polygon(
            (ox, oy), ctrl, tip,
            base_w, tip_w,
            steps=150
        )
        draw.polygon(poly, fill=GOLD)

    # ── Origin disc — small, clean, covers the raw base join ─────────────────
    acc_r = size * 0.022
    draw.ellipse(
        [(ox - acc_r, oy - acc_r), (ox + acc_r, oy + acc_r)],
        fill=GOLD
    )

    return img


def render_icon(final_size=800):
    big  = render_icon_hires(final_size * SUPERSCALE)
    icon = big.resize((final_size, final_size), Image.LANCZOS)
    return icon


# ── Lockup renderer ───────────────────────────────────────────────────────────

def render_lockup(icon_size=220):
    icon = render_icon(icon_size)

    font_path_bold = os.path.join(FONT_DIR, "BigShoulders-Bold.ttf")
    font_path_sub  = os.path.join(FONT_DIR, "Outfit-Regular.ttf")

    try:
        font_main = ImageFont.truetype(font_path_bold, int(icon_size * 0.40))
        font_sub  = ImageFont.truetype(font_path_sub,  int(icon_size * 0.155))
    except Exception as e:
        print(f"Font load warning: {e}")
        font_main = ImageFont.load_default()
        font_sub  = font_main

    # Measure text on a scratch image
    tmp  = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    bb_m = tmp.textbbox((0, 0), "LocalClaw",        font=font_main)
    bb_s = tmp.textbbox((0, 0), "Managed AI Agents", font=font_sub)

    text_w = max(bb_m[2] - bb_m[0], bb_s[2] - bb_s[0])
    line_gap = int(icon_size * 0.055)
    text_h = (bb_m[3] - bb_m[1]) + line_gap + (bb_s[3] - bb_s[1])

    pad_v = int(icon_size * 0.20)
    pad_h = int(icon_size * 0.18)
    gap   = int(icon_size * 0.14)

    total_w = pad_h + icon_size + gap + text_w + pad_h
    total_h = pad_v * 2 + max(icon_size, text_h)

    lockup = Image.new("RGB", (total_w, total_h), BG)
    draw   = ImageDraw.Draw(lockup)

    # Thin separator line along bottom — subtle brand touch
    sep_y = total_h - int(icon_size * 0.04)
    draw.rectangle(
        [(pad_h, sep_y), (total_w - pad_h, sep_y + max(1, int(icon_size * 0.004)))],
        fill=GOLD_DIM
    )

    # Icon — centred vertically
    icon_y = (total_h - icon_size) // 2
    lockup.paste(icon, (pad_h, icon_y))

    # Text block — centred vertically
    text_block_top = (total_h - text_h) // 2
    tx = pad_h + icon_size + gap

    draw.text((tx, text_block_top),
              "LocalClaw",
              font=font_main,
              fill=CREAM)

    sub_y = text_block_top + (bb_m[3] - bb_m[1]) + line_gap
    draw.text((tx, sub_y),
              "Managed AI Agents",
              font=font_sub,
              fill=GOLD)

    return lockup


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    icon_path   = os.path.join(OUT_DIR, "localclaw-icon.png")
    lockup_path = os.path.join(OUT_DIR, "localclaw-lockup.png")

    print("Rendering icon (800×800, 4× superscale)…")
    icon = render_icon(800)
    icon.save(icon_path, "PNG", optimize=True)
    print(f"  → {icon_path}")

    print("Rendering lockup…")
    lockup = render_lockup(220)
    lockup.save(lockup_path, "PNG", optimize=True)
    print(f"  → {lockup_path}")

    print("Done.")
