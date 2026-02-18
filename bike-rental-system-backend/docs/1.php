<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 1200 960" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="960" fill="#f8f9fa"/>
  <text x="600" y="30" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle">Bike Rental System - Database Schema (Laravel Implementation)</text>

  <!-- Bikes Table -->
  <rect x="50" y="80" width="250" height="220" fill="#d1e7dd" stroke="#198754" stroke-width="2" rx="5"/>
  <text x="175" y="105" font-family="Arial" font-size="18" font-weight="bold" text-anchor="middle">Bikes</text>
  <line x1="50" y1="115" x2="300" y2="115" stroke="#198754" stroke-width="2"/>
  <text x="60" y="140" font-family="Arial" font-size="14">id (PK)</text>
  <text x="60" y="160" font-family="Arial" font-size="14">model</text>
  <text x="60" y="180" font-family="Arial" font-size="14">brand</text>
  <text x="60" y="200" font-family="Arial" font-size="14">type</text>
  <text x="60" y="220" font-family="Arial" font-size="14">description</text>
  <text x="60" y="240" font-family="Arial" font-size="14">hourly_rate</text>
  <text x="60" y="260" font-family="Arial" font-size="14">daily_rate</text>
  <text x="60" y="280" font-family="Arial" font-size="14">images (json)</text>

  <!-- BikeInventory Table -->
  <rect x="400" y="80" width="250" height="220" fill="#cfe2ff" stroke="#0d6efd" stroke-width="2" rx="5"/>
  <text x="525" y="105" font-family="Arial" font-size="18" font-weight="bold" text-anchor="middle">BikeInventory</text>
  <line x1="400" y1="115" x2="650" y2="115" stroke="#0d6efd" stroke-width="2"/>
  <text x="410" y="140" font-family="Arial" font-size="14">id (PK)</text>
  <text x="410" y="160" font-family="Arial" font-size="14">bike_id (FK)</text>
  <text x="410" y="180" font-family="Arial" font-size="14">plate_number</text>
  <text x="410" y="200" font-family="Arial" font-size="14">serial_number</text>
  <text x="410" y="220" font-family="Arial" font-size="14">status</text>
  <text x="410" y="240" font-family="Arial" font-size="14">last_maintenance_date</text>
  <text x="410" y="260" font-family="Arial" font-size="14">created_at</text>
  <text x="410" y="280" font-family="Arial" font-size="14">updated_at</text>

  <!-- Users Table -->
  <rect x="850" y="80" width="250" height="220" fill="#f8d7da" stroke="#dc3545" stroke-width="2" rx="5"/>
  <text x="975" y="105" font-family="Arial" font-size="18" font-weight="bold" text-anchor="middle">Users</text>
  <line x1="850" y1="115" x2="1100" y2="115" stroke="#dc3545" stroke-width="2"/>
  <text x="860" y="140" font-family="Arial" font-size="14">id (PK)</text>
  <text x="860" y="160" font-family="Arial" font-size="14">name</text>
  <text x="860" y="180" font-family="Arial" font-size="14">email</text>
  <text x="860" y="200" font-family="Arial" font-size="14">email_verified_at</text>
  <text x="860" y="220" font-family="Arial" font-size="14">password</text>
  <text x="860" y="240" font-family="Arial" font-size="14">phone_number</text>
  <text x="860" y="260" font-family="Arial" font-size="14">address</text>
  <text x="860" y="280" font-family="Arial" font-size="14">user_type</text>

  <!-- Reservations Table -->
  <rect x="400" y="380" width="250" height="200" fill="#fff3cd" stroke="#ffc107" stroke-width="2" rx="5"/>
  <text x="525" y="405" font-family="Arial" font-size="18" font-weight="bold" text-anchor="middle">Reservations</text>
  <line x1="400" y1="415" x2="650" y2="415" stroke="#ffc107" stroke-width="2"/>
  <text x="410" y="440" font-family="Arial" font-size="14">id (PK)</text>
  <text x="410" y="460" font-family="Arial" font-size="14">user_id (FK)</text>
  <text x="410" y="480" font-family="Arial" font-size="14">bike_inventory_id (FK)</text>
  <text x="410" y="500" font-family="Arial" font-size="14">start_datetime</text>
  <text x="410" y="520" font-family="Arial" font-size="14">end_datetime</text>
  <text x="410" y="540" font-family="Arial" font-size="14">pay_amount</text>
  <text x="410" y="560" font-family="Arial" font-size="14">status</text>

  <!-- Payments Table -->
  <rect x="750" y="380" width="250" height="180" fill="#e2f3fc" stroke="#0dcaf0" stroke-width="2" rx="5"/>
  <text x="875" y="405" font-family="Arial" font-size="18" font-weight="bold" text-anchor="middle">Payments</text>
  <line x1="750" y1="415" x2="1000" y2="415" stroke="#0dcaf0" stroke-width="2"/>
  <text x="760" y="440" font-family="Arial" font-size="14">id (PK)</text>
  <text x="760" y="460" font-family="Arial" font-size="14">reservation_id (FK)</text>
  <text x="760" y="480" font-family="Arial" font-size="14">amount</text>
  <text x="760" y="500" font-family="Arial" font-size="14">payment_method</text>
  <text x="760" y="520" font-family="Arial" font-size="14">transaction_id</text>
  <text x="760" y="540" font-family="Arial" font-size="14">razor_pay_id</text>
  <text x="760" y="560" font-family="Arial" font-size="14">status</text>

  <!-- Reviews Table -->
  <rect x="50" y="380" width="250" height="180" fill="#f1d5fe" stroke="#6f42c1" stroke-width="2" rx="5"/>
  <text x="175" y="405" font-family="Arial" font-size="18" font-weight="bold" text-anchor="middle">Reviews</text>
  <line x1="50" y1="415" x2="300" y2="415" stroke="#6f42c1" stroke-width="2"/>
  <text x="60" y="440" font-family="Arial" font-size="14">id (PK)</text>
  <text x="60" y="460" font-family="Arial" font-size="14">user_id (FK)</text>
  <text x="60" y="480" font-family="Arial" font-size="14">bike_id (FK)</text>
  <text x="60" y="500" font-family="Arial" font-size="14">bike_inventory_id (FK)</text>
  <text x="60" y="520" font-family="Arial" font-size="14">reservation_id (FK)</text>
  <text x="60" y="540" font-family="Arial" font-size="14">rating</text>
  <text x="60" y="560" font-family="Arial" font-size="14">title & comment</text>

  <!-- MaintenanceRecords Table -->
  <rect x="50" y="650" width="250" height="200" fill="#d6d8db" stroke="#6c757d" stroke-width="2" rx="5"/>
  <text x="175" y="675" font-family="Arial" font-size="18" font-weight="bold" text-anchor="middle">MaintenanceRecords</text>
  <line x1="50" y1="685" x2="300" y2="685" stroke="#6c757d" stroke-width="2"/>
  <text x="60" y="710" font-family="Arial" font-size="14">id (PK)</text>
  <text x="60" y="730" font-family="Arial" font-size="14">bike_inventory_id (FK)</text>
  <text x="60" y="750" font-family="Arial" font-size="14">maintenance_type</text>
  <text x="60" y="770" font-family="Arial" font-size="14">description</text>
  <text x="60" y="790" font-family="Arial" font-size="14">cost</text>
  <text x="60" y="810" font-family="Arial" font-size="14">scheduled_date</text>
  <text x="60" y="830" font-family="Arial" font-size="14">completion_date</text>
  
  <!-- DamageReports Table -->
  <rect x="400" y="650" width="250" height="220" fill="#f8e3db" stroke="#fd7e14" stroke-width="2" rx="5"/>
  <text x="525" y="675" font-family="Arial" font-size="18" font-weight="bold" text-anchor="middle">DamageReports</text>
  <line x1="400" y1="685" x2="650" y2="685" stroke="#fd7e14" stroke-width="2"/>
  <text x="410" y="710" font-family="Arial" font-size="14">id (PK)</text>
  <text x="410" y="730" font-family="Arial" font-size="14">reservation_id (FK)</text>
  <text x="410" y="750" font-family="Arial" font-size="14">bike_inventory_id (FK)</text>
  <text x="410" y="770" font-family="Arial" font-size="14">reported_by (FK to users)</text>
  <text x="410" y="790" font-family="Arial" font-size="14">description</text>
  <text x="410" y="810" font-family="Arial" font-size="14">images (json)</text>
  <text x="410" y="830" font-family="Arial" font-size="14">severity</text>
  <text x="410" y="850" font-family="Arial" font-size="14">additional_charges</text>

  <!-- Personal Access Tokens Table -->
  <rect x="750" y="650" width="250" height="180" fill="#e6e6ff" stroke="#6610f2" stroke-width="2" rx="5"/>
  <text x="875" y="675" font-family="Arial" font-size="18" font-weight="bold" text-anchor="middle">PersonalAccessTokens</text>
  <line x1="750" y1="685" x2="1000" y2="685" stroke="#6610f2" stroke-width="2"/>
  <text x="760" y="710" font-family="Arial" font-size="14">id (PK)</text>
  <text x="760" y="730" font-family="Arial" font-size="14">tokenable_id</text>
  <text x="760" y="750" font-family="Arial" font-size="14">tokenable_type</text>
  <text x="760" y="770" font-family="Arial" font-size="14">name</text>
  <text x="760" y="790" font-family="Arial" font-size="14">token</text>
  <text x="760" y="810" font-family="Arial" font-size="14">abilities</text>
  <text x="760" y="830" font-family="Arial" font-size="14">last_used_at</text>

  <!-- Relationship lines -->
  <!-- Bikes to BikeInventory -->
  <line x1="300" y1="160" x2="400" y2="160" stroke="#333" stroke-width="2"/>
  <polygon points="390,155 400,160 390,165" fill="#333"/>
  <text x="350" y="150" font-family="Arial" font-size="12" text-anchor="middle">1:N</text>
  
  <!-- BikeInventory to Reservations -->
  <line x1="525" y1="300" x2="525" y2="380" stroke="#333" stroke-width="2"/>
  <polygon points="520,370 525,380 530,370" fill="#333"/>
  <text x="540" y="340" font-family="Arial" font-size="12" text-anchor="middle">1:N</text>
  
  <!-- Users to Reservations -->
  <line x1="850" y1="180" x2="650" y2="460" stroke="#333" stroke-width="2"/>
  <polygon points="658,452 650,460 662,468" fill="#333"/>
  <text x="750" y="300" font-family="Arial" font-size="12" text-anchor="middle">1:N</text>
  
  <!-- Reservations to Payments -->
  <line x1="650" y1="460" x2="750" y2="460" stroke="#333" stroke-width="2"/>
  <polygon points="740,455 750,460 740,465" fill="#333"/>
  <text x="700" y="445" font-family="Arial" font-size="12" text-anchor="middle">1:N</text>
  
  <!-- Reservations to Reviews -->
  <line x1="400" y1="480" x2="300" y2="520" stroke="#333" stroke-width="2"/>
  <polygon points="310,513 300,520 308,527" fill="#333"/>
  <text x="350" y="490" font-family="Arial" font-size="12" text-anchor="middle">1:1</text>
  
  <!-- Users to Reviews -->
  <line x1="900" y1="300" x2="175" y2="380" stroke="#333" stroke-width="2"/>
  <polygon points="182,373 175,380 184,387" fill="#333"/>
  
  <!-- BikeInventory to MaintenanceRecords -->
  <line x1="450" y1="300" x2="175" y2="650" stroke="#333" stroke-width="2"/>
  <polygon points="182,642 175,650 187,658" fill="#333"/>
  <text x="300" y="500" font-family="Arial" font-size="12" text-anchor="middle">1:N</text>
  
  <!-- Reservations to DamageReports -->
  <line x1="525" y1="580" x2="525" y2="650" stroke="#333" stroke-width="2"/>
  <polygon points="520,640 525,650 530,640" fill="#333"/>
  <text x="545" y="620" font-family="Arial" font-size="12" text-anchor="middle">1:N</text>
  
  <!-- Users to DamageReports -->
  <line x1="975" y1="300" x2="525" y2="770" stroke="#333" stroke-width="2"/>
  <polygon points="534,762 525,770 537,777" fill="#333"/>
  
  <!-- Bikes to Reviews direct relationship -->
  <line x1="175" y1="300" x2="175" y2="380" stroke="#333" stroke-width="2"/>
  <polygon points="170,370 175,380 180,370" fill="#333"/>
  
  <!-- BikeInventory to Reviews -->
  <line x1="400" y1="200" x2="175" y2="500" stroke="#333" stroke-width="2"/>
  <polygon points="183,492 175,500 187,506" fill="#333"/>

  <!-- Legend -->
  <rect x="750" y="840" width="350" height="100" fill="white" stroke="#333" stroke-width="1" rx="5"/>
  <text x="925" y="860" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle">Legend</text>
  <line x1="750" y1="870" x2="1100" y2="870" stroke="#333" stroke-width="1"/>
  
  <rect x="770" y="885" width="15" height="15" fill="#d1e7dd" stroke="#198754" stroke-width="1"/>
  <text x="795" y="897" font-family="Arial" font-size="12">Bike Models</text>
  
  <rect x="770" y="910" width="15" height="15" fill="#cfe2ff" stroke="#0d6efd" stroke-width="1"/>
  <text x="795" y="922" font-family="Arial" font-size="12">Inventory</text>
  
  <rect x="860" y="885" width="15" height="15" fill="#f8d7da" stroke="#dc3545" stroke-width="1"/>
  <text x="885" y="897" font-family="Arial" font-size="12">User Data</text>
  
  <rect x="860" y="910" width="15" height="15" fill="#fff3cd" stroke="#ffc107" stroke-width="1"/>
  <text x="885" y="922" font-family="Arial" font-size="12">Rental Data</text>
  
  <rect x="950" y="885" width="15" height="15" fill="#e2f3fc" stroke="#0dcaf0" stroke-width="1"/>
  <text x="975" y="897" font-family="Arial" font-size="12">Payments</text>
  
  <rect x="950" y="910" width="15" height="15" fill="#f8e3db" stroke="#fd7e14" stroke-width="1"/>
  <text x="975" y="922" font-family="Arial" font-size="12">Damage Reports</text>
  
  <rect x="1035" y="885" width="15" height="15" fill="#f1d5fe" stroke="#6f42c1" stroke-width="1"/>
  <text x="1060" y="897" font-family="Arial" font-size="12">Reviews</text>
  
  <rect x="1035" y="910" width="15" height="15" fill="#d6d8db" stroke="#6c757d" stroke-width="1"/>
  <text x="1060" y="922" font-family="Arial" font-size="12">Maintenance</text>
</svg>