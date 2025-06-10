import UIKit
import Observation

// MARK: - Observable Model

@Observable
class MessageStore {
    var unreadCount = 0
    var totalCount = 0
    
    var hasUnread: Bool {
        unreadCount > 0
    }
    
    var unreadPercentage: Double {
        guard totalCount > 0 else { return 0 }
        return Double(unreadCount) / Double(totalCount)
    }
}

// MARK: - View Controller

class MessageCounterViewController: UIViewController {
    let messageStore = MessageStore()
    
    // UI Elements
    let stackView = UIStackView()
    let titleLabel = UILabel()
    let unreadLabel = UILabel()
    let totalLabel = UILabel()
    let percentageLabel = UILabel()
    let badgeView = UIView()
    let progressView = UIProgressView()
    let markAllReadButton = UIButton(type: .system)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupViews()
        startMessageSimulation()
    }
    
    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        
        // All these UI updates happen automatically when messageStore properties change!
        unreadLabel.text = "Unread: \(messageStore.unreadCount)"
        totalLabel.text = "Total: \(messageStore.totalCount)"
        percentageLabel.text = String(format: "%.1f%% unread", messageStore.unreadPercentage * 100)
        
        // Update badge visibility and color
        badgeView.isHidden = !messageStore.hasUnread
        badgeView.backgroundColor = messageStore.unreadCount > 5 ? .systemRed : .systemBlue
        
        // Update progress
        progressView.progress = Float(messageStore.unreadPercentage)
        progressView.tintColor = messageStore.unreadPercentage > 0.5 ? .systemRed : .systemGreen
        
        // Update button state
        markAllReadButton.isEnabled = messageStore.hasUnread
    }
    
    private func setupViews() {
        view.backgroundColor = .systemBackground
        
        // Configure labels
        titleLabel.text = "Message Counter Demo"
        titleLabel.font = .boldSystemFont(ofSize: 24)
        titleLabel.textAlignment = .center
        
        unreadLabel.font = .systemFont(ofSize: 18)
        totalLabel.font = .systemFont(ofSize: 18)
        percentageLabel.font = .systemFont(ofSize: 16)
        percentageLabel.textColor = .secondaryLabel
        
        // Configure badge
        badgeView.backgroundColor = .systemBlue
        badgeView.layer.cornerRadius = 6
        badgeView.translatesAutoresizingMaskIntoConstraints = false
        
        // Configure button
        markAllReadButton.setTitle("Mark All Read", for: .normal)
        markAllReadButton.addTarget(self, action: #selector(markAllRead), for: .touchUpInside)
        
        // Setup stack view
        stackView.axis = .vertical
        stackView.spacing = 16
        stackView.translatesAutoresizingMaskIntoConstraints = false
        
        stackView.addArrangedSubview(titleLabel)
        stackView.addArrangedSubview(unreadLabel)
        stackView.addArrangedSubview(totalLabel)
        stackView.addArrangedSubview(percentageLabel)
        stackView.addArrangedSubview(progressView)
        stackView.addArrangedSubview(markAllReadButton)
        
        view.addSubview(stackView)
        view.addSubview(badgeView)
        
        // Layout
        NSLayoutConstraint.activate([
            stackView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            stackView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            stackView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 32),
            stackView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -32),
            
            badgeView.widthAnchor.constraint(equalToConstant: 12),
            badgeView.heightAnchor.constraint(equalToConstant: 12),
            badgeView.leadingAnchor.constraint(equalTo: unreadLabel.trailingAnchor, constant: 8),
            badgeView.centerYAnchor.constraint(equalTo: unreadLabel.centerYAnchor)
        ])
    }
    
    private func startMessageSimulation() {
        // Simulate receiving messages
        Timer.scheduledTimer(withTimeInterval: 1.5, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            
            self.messageStore.totalCount += 1
            
            // 30% chance of being unread
            if Bool.random() && Double.random(in: 0...1) < 0.3 {
                self.messageStore.unreadCount += 1
            }
        }
    }
    
    @objc private func markAllRead() {
        messageStore.unreadCount = 0
    }
}