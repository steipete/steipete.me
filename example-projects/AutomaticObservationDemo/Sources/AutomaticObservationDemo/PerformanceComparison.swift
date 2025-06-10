import UIKit
import Observation

// MARK: - Models

@Observable
class PerformanceTestModel {
    var items: [TestItem] = []
    
    struct TestItem {
        let id = UUID()
        var value: Int
        var isHighlighted: Bool
    }
    
    init() {
        // Create 1000 items for performance testing
        items = (0..<1000).map { TestItem(value: $0, isHighlighted: false) }
    }
    
    func randomizeValues() {
        for index in items.indices {
            items[index].value = Int.random(in: 0...1000)
            items[index].isHighlighted = Bool.random()
        }
    }
}

// Traditional model without observation
class TraditionalModel {
    var items: [TestItem] = []
    var updateHandler: (() -> Void)?
    
    struct TestItem {
        let id = UUID()
        var value: Int
        var isHighlighted: Bool
    }
    
    init() {
        items = (0..<1000).map { TestItem(value: $0, isHighlighted: false) }
    }
    
    func randomizeValues() {
        for index in items.indices {
            items[index].value = Int.random(in: 0...1000)
            items[index].isHighlighted = Bool.random()
        }
        updateHandler?()
    }
}

// MARK: - View Controllers

class PerformanceComparisonViewController: UIViewController {
    let segmentedControl = UISegmentedControl(items: ["Automatic", "Manual"])
    let containerView = UIView()
    
    var automaticVC: AutomaticUpdateViewController?
    var manualVC: ManualUpdateViewController?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Performance Comparison"
        view.backgroundColor = .systemBackground
        
        setupViews()
        showAutomatic()
    }
    
    private func setupViews() {
        segmentedControl.selectedSegmentIndex = 0
        segmentedControl.addTarget(self, action: #selector(segmentChanged), for: .valueChanged)
        segmentedControl.translatesAutoresizingMaskIntoConstraints = false
        
        containerView.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(segmentedControl)
        view.addSubview(containerView)
        
        NSLayoutConstraint.activate([
            segmentedControl.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            segmentedControl.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            segmentedControl.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            
            containerView.topAnchor.constraint(equalTo: segmentedControl.bottomAnchor, constant: 16),
            containerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            containerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            containerView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    @objc private func segmentChanged() {
        if segmentedControl.selectedSegmentIndex == 0 {
            showAutomatic()
        } else {
            showManual()
        }
    }
    
    private func showAutomatic() {
        manualVC?.removeFromParent()
        manualVC?.view.removeFromSuperview()
        
        let vc = AutomaticUpdateViewController()
        automaticVC = vc
        
        addChild(vc)
        containerView.addSubview(vc.view)
        vc.view.frame = containerView.bounds
        vc.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        vc.didMove(toParent: self)
    }
    
    private func showManual() {
        automaticVC?.removeFromParent()
        automaticVC?.view.removeFromSuperview()
        
        let vc = ManualUpdateViewController()
        manualVC = vc
        
        addChild(vc)
        containerView.addSubview(vc.view)
        vc.view.frame = containerView.bounds
        vc.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        vc.didMove(toParent: self)
    }
}

// MARK: - Automatic Updates

class AutomaticUpdateViewController: UIViewController {
    let model = PerformanceTestModel()
    let tableView = UITableView()
    let statsLabel = UILabel()
    let updateButton = UIButton(type: .system)
    
    var updateCount = 0
    var lastUpdateTime: CFAbsoluteTime = 0
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupViews()
        setupActions()
    }
    
    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        
        // Track performance
        let startTime = CFAbsoluteTimeGetCurrent()
        
        // Update stats (this establishes observation dependency)
        let highlightedCount = model.items.filter { $0.isHighlighted }.count
        statsLabel.text = "Updates: \(updateCount) | Highlighted: \(highlightedCount) | Last: \(String(format: "%.2fms", lastUpdateTime * 1000))"
        
        // Reload table if needed
        if updateCount > 0 {
            tableView.reloadData()
        }
        
        lastUpdateTime = CFAbsoluteTimeGetCurrent() - startTime
    }
    
    private func setupViews() {
        statsLabel.font = .monospacedSystemFont(ofSize: 12, weight: .regular)
        statsLabel.numberOfLines = 0
        statsLabel.translatesAutoresizingMaskIntoConstraints = false
        
        updateButton.setTitle("Randomize Data", for: .normal)
        updateButton.translatesAutoresizingMaskIntoConstraints = false
        
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
        tableView.dataSource = self
        tableView.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(statsLabel)
        view.addSubview(updateButton)
        view.addSubview(tableView)
        
        NSLayoutConstraint.activate([
            statsLabel.topAnchor.constraint(equalTo: view.topAnchor, constant: 16),
            statsLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            statsLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            
            updateButton.topAnchor.constraint(equalTo: statsLabel.bottomAnchor, constant: 8),
            updateButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            
            tableView.topAnchor.constraint(equalTo: updateButton.bottomAnchor, constant: 16),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    private func setupActions() {
        updateButton.addTarget(self, action: #selector(randomizeData), for: .touchUpInside)
    }
    
    @objc private func randomizeData() {
        updateCount += 1
        model.randomizeValues()
        // Table will reload automatically via viewWillLayoutSubviews
    }
}

// MARK: - Manual Updates

class ManualUpdateViewController: UIViewController {
    let model = TraditionalModel()
    let tableView = UITableView()
    let statsLabel = UILabel()
    let updateButton = UIButton(type: .system)
    
    var updateCount = 0
    var lastUpdateTime: CFAbsoluteTime = 0
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupViews()
        setupActions()
        
        // Manual update handler
        model.updateHandler = { [weak self] in
            self?.updateUI()
        }
    }
    
    private func updateUI() {
        let startTime = CFAbsoluteTimeGetCurrent()
        
        updateCount += 1
        
        // Manual stats update
        let highlightedCount = model.items.filter { $0.isHighlighted }.count
        statsLabel.text = "Updates: \(updateCount) | Highlighted: \(highlightedCount) | Last: \(String(format: "%.2fms", lastUpdateTime * 1000))"
        
        // Manual table reload
        tableView.reloadData()
        
        lastUpdateTime = CFAbsoluteTimeGetCurrent() - startTime
    }
    
    private func setupViews() {
        statsLabel.font = .monospacedSystemFont(ofSize: 12, weight: .regular)
        statsLabel.numberOfLines = 0
        statsLabel.translatesAutoresizingMaskIntoConstraints = false
        
        updateButton.setTitle("Randomize Data", for: .normal)
        updateButton.translatesAutoresizingMaskIntoConstraints = false
        
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
        tableView.dataSource = self
        tableView.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(statsLabel)
        view.addSubview(updateButton)
        view.addSubview(tableView)
        
        NSLayoutConstraint.activate([
            statsLabel.topAnchor.constraint(equalTo: view.topAnchor, constant: 16),
            statsLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            statsLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            
            updateButton.topAnchor.constraint(equalTo: statsLabel.bottomAnchor, constant: 8),
            updateButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            
            tableView.topAnchor.constraint(equalTo: updateButton.bottomAnchor, constant: 16),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    private func setupActions() {
        updateButton.addTarget(self, action: #selector(randomizeData), for: .touchUpInside)
    }
    
    @objc private func randomizeData() {
        model.randomizeValues()
    }
}

// MARK: - Table View Data Source

extension AutomaticUpdateViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return min(50, model.items.count) // Show first 50 for performance
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
        let item = model.items[indexPath.row]
        
        cell.textLabel?.text = "Item \(indexPath.row): \(item.value)"
        cell.backgroundColor = item.isHighlighted ? .systemYellow.withAlphaComponent(0.3) : .systemBackground
        
        return cell
    }
}

extension ManualUpdateViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return min(50, model.items.count) // Show first 50 for performance
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
        let item = model.items[indexPath.row]
        
        cell.textLabel?.text = "Item \(indexPath.row): \(item.value)"
        cell.backgroundColor = item.isHighlighted ? .systemYellow.withAlphaComponent(0.3) : .systemBackground
        
        return cell
    }
}