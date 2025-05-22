package com.posapp

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule


class BarcodeScannerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "BarcodeScanner"

    @ReactMethod
fun scanBarcode(imageData: ByteArray, width: Int, height: Int, promise: Promise) {
    val image = InputImage.fromByteArray(
        imageData,
        width,
        height,
        0,
        InputImage.IMAGE_FORMAT_NV21
    )

        val scanner = BarcodeScanning.getClient()
        scanner.process(image)
            .addOnSuccessListener { barcodes ->
                if (barcodes.isNotEmpty()) {
                    val barcode = barcodes[0]
                    barcode.rawValue?.let { value ->
                        promise.resolve(value)
                    } ?: promise.reject("ERROR", "No barcode value found")
                } else {
                    promise.reject("ERROR", "No barcode found")
                }
            }
            .addOnFailureListener { e ->
                promise.reject("ERROR", e.message)
            }
    }
}