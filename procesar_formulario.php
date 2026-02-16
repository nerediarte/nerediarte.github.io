<?php
// procesar_formulario.php
// Recibe JSON por POST y guarda pedidos/contactos en orders.csv
header('Content-Type: application/json; charset=utf-8');
// Leer entrada JSON
$raw = file_get_contents('php://input');
if(!$raw) {
    echo json_encode(['success' => false, 'message' => 'No input']);
    exit;
}
$data = json_decode($raw, true);
if(!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

// Generar número de pedido único
$orderNumber = 'ORD' . date('YmdHis') . rand(1000,9999);

$csvFile = __DIR__ . DIRECTORY_SEPARATOR . 'orders.csv';
$isNew = !file_exists($csvFile);

// Preparar fila CSV
$timestamp = date('c');
$type = isset($data['type']) ? $data['type'] : 'order';

// Campos comunes
$email = isset($data['email']) ? $data['email'] : '';
$productTitle = isset($data['productTitle']) ? $data['productTitle'] : '';
$productPrice = isset($data['productPrice']) ? $data['productPrice'] : '';
$cantidad = isset($data['cantidad']) ? $data['cantidad'] : '';
$nombre = isset($data['nombre']) ? $data['nombre'] : '';
$fecha = isset($data['fecha']) ? $data['fecha'] : '';
$parroquia = isset($data['parroquia']) ? $data['parroquia'] : '';
$texto = isset($data['texto']) ? $data['texto'] : '';
$mensaje = isset($data['mensaje']) ? $data['mensaje'] : '';
$subtotal = isset($data['subtotal']) ? $data['subtotal'] : '';

$row = [
    $orderNumber,
    $timestamp,
    $type,
    $email,
    $productTitle,
    $productPrice,
    $cantidad,
    $nombre,
    $fecha,
    $parroquia,
    $texto,
    $mensaje,
    $subtotal
];

// Abrir y escribir CSV
if(($handle = fopen($csvFile, 'a')) !== false) {
    if($isNew) {
        // Escribir cabecera
        fputcsv($handle, ['order_number','timestamp','type','email','product_title','product_price','cantidad','nombre','fecha','parroquia','texto','mensaje','subtotal']);
    }
    fputcsv($handle, $row);
    fclose($handle);
    // También devolver el número de pedido
    echo json_encode(['success' => true, 'order_number' => $orderNumber]);
    exit;
} else {
    echo json_encode(['success' => false, 'message' => 'No se pudo abrir el archivo']);
    exit;
}

?>
