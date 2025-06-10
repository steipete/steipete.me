import UIKit
import Observation

// MARK: - Observable Models

@Observable
class AppModel: Equatable {
    var currentUser: User?
    var theme: Theme = .light
    var isOnline = true
    
    static func == (lhs: AppModel, rhs: AppModel) -> Bool {
        // Identity-based equality for observable objects
        lhs === rhs
    }
}

@Observable
class User {
    var name: String
    var avatar: UIImage?
    var preferredLanguage: String = "en"
    
    init(name: String) {
        self.name = name
    }
}

enum Theme {
    case light, dark, system
    
    var backgroundColor: UIColor {
        switch self {
        case .light: return .systemBackground
        case .dark: return .black
        case .system: return .systemBackground
        }
    }
    
    var textColor: UIColor {
        switch self {
        case .light: return .label
        case .dark: return .white
        case .system: return .label
        }
    }
}

// MARK: - Custom Trait Definition

struct AppModelTrait: UITraitDefinition {
    static var defaultValue: AppModel? = nil
}

extension UITraitCollection {
    var appModel: AppModel? {
        self[AppModelTrait.self]
    }
}

extension UIMutableTraits {
    var appModel: AppModel? {
        get { self[AppModelTrait.self] }
        set { self[AppModelTrait.self] = newValue }
    }
}

// MARK: - Root View Controller

class RootViewController: UIViewController {
    let appModel = AppModel()
    let containerView = UIView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Set up the app model
        appModel.currentUser = User(name: "Demo User")
        
        // Inject the model into the trait system
        traitOverrides.appModel = appModel
        
        setupUI()
        addChildViewControllers()
        setupDemoControls()
    }
    
    private func setupUI() {
        view.backgroundColor = .systemBackground
        
        containerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(containerView)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 100),
            containerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            containerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            containerView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    private func addChildViewControllers() {
        let tabController = UITabBarController()
        
        let profileVC = ProfileViewController()
        profileVC.tabBarItem = UITabBarItem(title: "Profile", image: UIImage(systemName: "person"), tag: 0)
        
        let settingsVC = SettingsViewController()
        settingsVC.tabBarItem = UITabBarItem(title: "Settings", image: UIImage(systemName: "gear"), tag: 1)
        
        let statusVC = StatusViewController()
        statusVC.tabBarItem = UITabBarItem(title: "Status", image: UIImage(systemName: "wifi"), tag: 2)
        
        tabController.viewControllers = [
            UINavigationController(rootViewController: profileVC),
            UINavigationController(rootViewController: settingsVC),
            UINavigationController(rootViewController: statusVC)
        ]
        
        addChild(tabController)
        containerView.addSubview(tabController.view)
        tabController.view.frame = containerView.bounds
        tabController.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        tabController.didMove(toParent: self)
    }
    
    private func setupDemoControls() {
        let controlsStack = UIStackView()
        controlsStack.axis = .horizontal
        controlsStack.spacing = 16
        controlsStack.translatesAutoresizingMaskIntoConstraints = false
        
        let themeButton = UIButton(type: .system)
        themeButton.setTitle("Toggle Theme", for: .normal)
        themeButton.addTarget(self, action: #selector(toggleTheme), for: .touchUpInside)
        
        let userButton = UIButton(type: .system)
        userButton.setTitle("Change User", for: .normal)
        userButton.addTarget(self, action: #selector(changeUser), for: .touchUpInside)
        
        let onlineButton = UIButton(type: .system)
        onlineButton.setTitle("Toggle Online", for: .normal)
        onlineButton.addTarget(self, action: #selector(toggleOnline), for: .touchUpInside)
        
        controlsStack.addArrangedSubview(themeButton)
        controlsStack.addArrangedSubview(userButton)
        controlsStack.addArrangedSubview(onlineButton)
        
        view.addSubview(controlsStack)
        
        NSLayoutConstraint.activate([
            controlsStack.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            controlsStack.centerXAnchor.constraint(equalTo: view.centerXAnchor)
        ])
    }
    
    @objc private func toggleTheme() {
        appModel.theme = appModel.theme == .light ? .dark : .light
    }
    
    @objc private func changeUser() {
        let names = ["Alice", "Bob", "Charlie", "Diana", "Eve"]
        let newName = names.randomElement() ?? "User"
        appModel.currentUser = User(name: newName)
    }
    
    @objc private func toggleOnline() {
        appModel.isOnline.toggle()
    }
}

// MARK: - Child View Controllers

class ProfileViewController: UIViewController {
    let nameLabel = UILabel()
    let languageLabel = UILabel()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Profile"
        
        setupViews()
    }
    
    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        
        // Automatically updates when appModel changes!
        if let model = traitCollection.appModel {
            view.backgroundColor = model.theme.backgroundColor
            nameLabel.textColor = model.theme.textColor
            languageLabel.textColor = model.theme.textColor
            
            if let user = model.currentUser {
                nameLabel.text = "Hello, \(user.name)!"
                languageLabel.text = "Language: \(user.preferredLanguage)"
            }
        }
    }
    
    private func setupViews() {
        let stack = UIStackView(arrangedSubviews: [nameLabel, languageLabel])
        stack.axis = .vertical
        stack.spacing = 8
        stack.translatesAutoresizingMaskIntoConstraints = false
        
        nameLabel.font = .boldSystemFont(ofSize: 24)
        languageLabel.font = .systemFont(ofSize: 18)
        
        view.addSubview(stack)
        
        NSLayoutConstraint.activate([
            stack.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            stack.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
}

class SettingsViewController: UIViewController {
    let themeLabel = UILabel()
    let statusLabel = UILabel()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Settings"
        
        setupViews()
    }
    
    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        
        if let model = traitCollection.appModel {
            view.backgroundColor = model.theme.backgroundColor
            themeLabel.textColor = model.theme.textColor
            statusLabel.textColor = model.theme.textColor
            
            themeLabel.text = "Current Theme: \(model.theme == .light ? "Light" : "Dark")"
            navigationItem.title = "Settings for \(model.currentUser?.name ?? "Guest")"
        }
    }
    
    private func setupViews() {
        let stack = UIStackView(arrangedSubviews: [themeLabel, statusLabel])
        stack.axis = .vertical
        stack.spacing = 8
        stack.translatesAutoresizingMaskIntoConstraints = false
        
        themeLabel.font = .systemFont(ofSize: 18)
        
        view.addSubview(stack)
        
        NSLayoutConstraint.activate([
            stack.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            stack.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
}

class StatusViewController: UIViewController {
    let statusIndicator = UIView()
    let statusLabel = UILabel()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Status"
        
        setupViews()
    }
    
    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        
        if let model = traitCollection.appModel {
            view.backgroundColor = model.theme.backgroundColor
            statusLabel.textColor = model.theme.textColor
            
            statusIndicator.backgroundColor = model.isOnline ? .systemGreen : .systemRed
            statusLabel.text = model.isOnline ? "Online" : "Offline"
        }
    }
    
    private func setupViews() {
        statusIndicator.layer.cornerRadius = 10
        statusIndicator.translatesAutoresizingMaskIntoConstraints = false
        
        statusLabel.font = .systemFont(ofSize: 18)
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(statusIndicator)
        view.addSubview(statusLabel)
        
        NSLayoutConstraint.activate([
            statusIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            statusIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -20),
            statusIndicator.widthAnchor.constraint(equalToConstant: 20),
            statusIndicator.heightAnchor.constraint(equalToConstant: 20),
            
            statusLabel.topAnchor.constraint(equalTo: statusIndicator.bottomAnchor, constant: 16),
            statusLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor)
        ])
    }
}