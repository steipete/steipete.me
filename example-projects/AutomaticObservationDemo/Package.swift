// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "AutomaticObservationDemo",
    platforms: [
        .iOS(.v18),
        .macOS(.v15)
    ],
    products: [
        .library(
            name: "AutomaticObservationDemo",
            targets: ["AutomaticObservationDemo"]),
    ],
    targets: [
        .target(
            name: "AutomaticObservationDemo"),
        .testTarget(
            name: "AutomaticObservationDemoTests",
            dependencies: ["AutomaticObservationDemo"]),
    ]
)