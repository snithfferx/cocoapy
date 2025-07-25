import cv2
import base64
import numpy as np
from typing import Tuple
from io import BytesIO
import os

def imagen_a_base64(imagen) -> str:
    _, buffer = cv2.imencode('.png', imagen)
    return base64.b64encode(buffer).decode('utf-8')

def mejorar_contraste_clahe(imagen_gray: np.ndarray) -> np.ndarray:
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    return clahe.apply(imagen_gray)

def contar_colonias(cut,sensibility:int=50):
    # Aplicar umbralización adaptativa para mejorar la detección de colonias
    _, thresh = cv2.threshold(cut, sensibility, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    # Encontrar contornos
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Filtrar contornos pequeños
    colonias = [cnt for cnt in contours if cv2.contourArea(cnt) > 20]

    return len(colonias), thresh

def guardar_corte_cuadrante(corte: np.ndarray, i: int, j: int, folder: str = "temp_cuadrantes"):
    # Crear el folder si no existe
    if not os.path.exists(folder):
        os.makedirs(folder)
    # Construir el nombre del archivo
    filename = f"cuadrante_{i}_{j}.png"
    filepath = os.path.join(folder, filename)
    # Guardar la imagen
    cv2.imwrite(filepath, corte)

def contar_colonias_por_cuadrante(img_bytes: BytesIO, sensibilidad:int, cuadrantes=(2, 2)) -> Tuple[int, str, list[int], list[str]]:
    file_bytes = np.asarray(bytearray(img_bytes.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # Escala de grises y aumento de contraste
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    contrast = mejorar_contraste_clahe(gray)

    h, w = contrast.shape
    qh, qw = h // cuadrantes[0], w // cuadrantes[1]
    colonias_totales = []
    colonias_imagenes = []

    for i in range(cuadrantes[0]):
        for j in range(cuadrantes[1]):
            corte = contrast[i*qh:(i+1)*qh, j*qw:(j+1)*qw]

            # Guardar el corte del cuadrante
            guardar_corte_cuadrante(corte, i, j)
            # Aplicar desenfoque y contar colonias
            # (Se puede ajustar el tamaño del kernel según sea necesario)
            # blur = cv2.GaussianBlur(corte, (5, 5), 0)
            # colonias, _ = contar_colonias(blur,sensibilidad)
            colonias, imagenCorte = contar_por_cuadrante_en_corte(corte, sensibilidad)
            colonias_totales.append(colonias)
            colonias_imagenes.append(imagenCorte)

    # Promedio aritmético de colonias por cuadrante
    media = int(np.mean(colonias_totales))
    # Visualización de cuadrantes y colonias detectadas
    vis_img = visualizar_cuadrantes(contrast, cuadrantes, colonias_totales)
    # Convertir la imagen a base64
    img_base64 = imagen_a_base64(vis_img)
    """ {
        status: 'ok',
        data: {
          avg: average,
          ovi: overviewImg64,
          totals: {
            quarters: quartersOQ,
            values: totalColoniesByQuarter,
            images: quarterImage
          },
          name: name
        } """
    return media, img_base64, colonias_totales, colonias_imagenes

def visualizar_cuadrantes(contrast, cuadrantes, totales):
    # Asegurarse de que contrast sea una imagen en escala de grises
    if len(contrast.shape) == 3:
        # Si ya es una imagen a color, usarla directamente
        vis_img = contrast.copy()
    else:
        # Si es una imagen en escala de grises, convertirla a color
        vis_img = cv2.cvtColor(contrast, cv2.COLOR_GRAY2BGR)
    
    h, w = contrast.shape[:2]  # Usar [:2] para manejar tanto imágenes en color como en escala de grises
    qh, qw = h // cuadrantes[0], w // cuadrantes[1]

    idx = 0
    for i in range(cuadrantes[0]):
        for j in range(cuadrantes[1]):
            x, y = j * qw, i * qh
            cv2.rectangle(vis_img, (x, y), (x + qw, y + qh), (0, 255, 0), 1)
            texto = str(totales[idx])
            cv2.putText(vis_img, texto, (x + 5, y + 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
            idx += 1
    return vis_img

def contar_por_cuadrante_en_corte(corte: np.ndarray, sensibilidad: int = 50) -> Tuple[int, str]:
    altura, ancho = corte.shape
    alturaCuadrante, anchoCuadrante = altura // 2, ancho // 2
    totales = []
    for i in range(2):
        for j in range(2):
            # Definir el corte del cuadrante
            x1, y1 = j * anchoCuadrante, i * alturaCuadrante
            x2, y2 = x1 + anchoCuadrante, y1 + alturaCuadrante
            cuadrante = corte[y1:y2, x1:x2]
            # Aplicar desenfoque y contar colonias
            cuadranteConBlur = cv2.GaussianBlur(cuadrante, (5, 5), 0)
            colonias, _ = contar_colonias(cuadranteConBlur, sensibilidad)
            # Almacenar el total de colonias
            totales.append(colonias)
    # Promedio aritmético de colonias por cuadrante
    total = int(np.sum(totales))
    return total, imagen_a_base64(visualizar_cuadrantes(corte, (2, 2), totales))

def matching_template(img: np.ndarray, template: np.ndarray) -> Tuple[float, str]:
    # img = cv2.imread('grande.jpg', 0)
    # template = cv2.imread('plantilla.jpg', 0)
    w, h = template.shape[::-1]
    orb = cv2.ORB_create()
    kp1, des1 = orb.detectAndCompute(img, None)
    kp2, des2 = orb.detectAndCompute(template, None)

    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(des1, des2)
    matches = sorted(matches, key=lambda x: x.distance)

    good_matches = matches[:10]
    src_pts = np.float32([kp1[m.queryIdx].pt for m in good_matches]).reshape(-1, 1, 2)
    dst_pts = np.float32([kp2[m.trainIdx].pt for m in good_matches]).reshape(-1, 1, 2)

    M, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)

    matchesMask = mask.ravel().tolist()

    h, w = template.shape[:2]
    pts = np.float32([[0, 0], [0, h - 1], [w - 1, h - 1], [w - 1, 0]]).reshape(-1, 1, 2)
    dst = cv2.perspectiveTransform(pts, M)

    img = cv2.polylines(img, [np.int32(dst)], True, 255, 3, cv2.LINE_AA)

    draw_params = dict(matchColor=(0, 255, 0),
                       singlePointColor=None,
                       matchesMask=matchesMask,
                       flags=2)

    img2 = cv2.drawMatches(img, kp1, template, kp2, good_matches, None, **draw_params)

    return len(good_matches), imagen_a_base64(img2)
    # res = cv2.matchTemplate(img, template, cv2.TM_CCOEFF_NORMED)
    # threshold = 0.8
    # loc = np.where(res >= threshold)

    # for pt in zip(*loc[::-1]):
    #     cv2.rectangle(img, pt, (pt[0] + w, pt[1] + h), 255, 2)

    # cv2.imwrite('resultado.png', img)