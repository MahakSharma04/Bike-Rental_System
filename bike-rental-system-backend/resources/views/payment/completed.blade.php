<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
   <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <!-- CSRF Token -->
      <meta name="csrf-token" content="{{ csrf_token() }}">
      <title>Bike Rental System - Payment Receipt</title>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
   </head>
   <body>
      <div id="app">
         <main class="py-4">
            <div class="container">
               <div class="row justify-content-center">
                  <div class="col-md-8">
                     <div class="card">
                        <div class="card-header bg-success text-white">
                           <h4>Payment Successful</h4>
                        </div>
                        <div class="card-body">
                           <div class="text-center mb-4">
                              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
                                 <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                              </svg>
                           </div>
                           
                           <h5 class="card-title">Payment Receipt</h5>
                           <div class="table-responsive">
                              <table class="table table-bordered">
                                 <tbody>
                                    <tr>
                                       <th>Transaction ID</th>
                                       <td>{{ $payment->transaction_id }}</td>
                                    </tr>
                                    <tr>
                                       <th>Amount Paid</th>
                                       <td>₹{{ number_format($payment->amount, 2) }}</td>
                                    </tr>
                                    <tr>
                                       <th>Payment Method</th>
                                       <td>{{ ucfirst($payment->payment_method) }}</td>
                                    </tr>
                                    <tr>
                                       <th>Payment Date</th>
                                       <td>{{ $payment->payment_date->format('F j, Y, g:i a') }}</td>
                                    </tr>
                                    <tr>
                                       <th>Status</th>
                                       <td><span class="badge badge-success">{{ ucfirst($payment->status) }}</span></td>
                                    </tr>
                                 </tbody>
                              </table>
                           </div>
                           
                           <h5 class="card-title mt-4">Reservation Details</h5>
                           <div class="table-responsive">
                              <table class="table table-bordered">
                                 <tbody>
                                    <tr>
                                       <th>Bike</th>
                                       <td>{{ $reservation->bike->brand }} {{ $reservation->bike->model }}</td>
                                    </tr>
                                    <tr>
                                       <th>Reservation ID</th>
                                       <td>{{ $reservation->id }}</td>
                                    </tr>
                                    <tr>
                                       <th>Start Date</th>
                                       <td>{{ $reservation->start_datetime }}</td>
                                    </tr>
                                    <tr>
                                       <th>End Date</th>
                                       <td>{{ $reservation->end_datetime }}</td>
                                    </tr>
                                    <tr>
                                       <th>Status</th>
                                       <td><span class="badge badge-primary">{{ ucfirst($reservation->status) }}</span></td>
                                    </tr>
                                 </tbody>
                              </table>
                           </div>
                           
                           <div class="text-center mt-4">
                              <a href="/api/reservations/{{ $reservation->id }}" class="btn btn-primary">View Reservation</a>
                              <a href="/dashboard" class="btn btn-secondary">Back to Dashboard</a>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </main>
      </div>
   </body>
</html> 