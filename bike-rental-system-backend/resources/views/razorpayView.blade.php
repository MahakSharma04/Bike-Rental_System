<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
   <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <!-- CSRF Token -->
      <meta name="csrf-token" content="{{ csrf_token() }}">
      <title>Bike Rental System - Payment</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" crossorigin="anonymous"></script>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
   </head>
   <body>
      <div id="app">
         <main class="py-4">
            <div class="container">
               <div class="row">
                  <div class="col-md-6 offset-3 col-md-offset-6">
                     <div class="card card-default">
                        <div class="card-header">
                           Bike Rental - Payment
                        </div>
                        <div class="card-body">
                           @if (isset($success) && $success == 'true')
                           <div class="alert alert-success">
                              Payment completed successfully! Your reservation is now confirmed.
                              <p class="mt-2"><a href="#" onclick="window.close()">Close this window</a></p>
                           </div>
                           @elseif (isset($error))
                           <div class="alert alert-danger">
                              Payment failed: {{ $error }}
                              <p class="mt-2">Please try again or contact support.</p>
                           </div>
                           @endif

                           <div class="mb-4">
                              <h5>Reservation Details:</h5>
                              <p><strong>Bike:</strong> {{ $reservation->bike->brand }} {{ $reservation->bike->model }}</p>
                              <p><strong>From:</strong> {{ $reservation->start_datetime }}</p>
                              <p><strong>To:</strong> {{ $reservation->end_datetime }}</p>
                              <p><strong>Amount:</strong> ₹{{ number_format($reservation->pay_amount, 2) }}</p>
                           </div>
                           
                           @if (!isset($success) || $success != 'true')
                           <div class="text-center">
                              <button id="payment-button" class="btn btn-primary btn-lg my-3">Pay ₹{{ number_format($reservation->pay_amount, 2) }}</button>
                              <form id="payment-form" target="_self">
                                 <input type="hidden" name="_token" id="csrf-token" value="{{ csrf_token() }}">
                                 <input type="hidden" name="reservation_id" id="reservation_id" value="{{ $reservationId }}">
                                 <input type="hidden" name="success" id="success-input" value="">
                                 <input type="hidden" name="error" id="error-input" value="">
                              </form>
                           </div>

                           <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                           <script type="text/javascript">
                              // Initialize Razorpay checkout
                              var options = {
                                 key: "rzp_test_wKSpsp0shnBr2a",
                                 amount: "{{ $amount }}",
                                 currency: "INR",
                                 name: "Bike Rental",
                                 description: "Rozerpay",
                                 image: "https://cybercollege.info/wp-content/uploads/2021/06/cropped-logo.png",
                                 prefill: {
                                    name: "{{ $name }}",
                                    email: "{{ $email }}"
                                 },
                                 theme: {
                                    color: "#F37254"
                                 },
                                 modal: {
                                    ondismiss: function() {
                                       console.log("Checkout form closed");
                                    }
                                 },
                                 handler: function(response) {
                                    console.log("Payment successful", response);
                                    
                                    // Get form and form data
                                    var form = document.getElementById('payment-form');
                                    var formData = new FormData(form);
                                    
                                    // Add Razorpay data
                                    formData.append('razorpay_payment_id', response.razorpay_payment_id);
                                    if (response.razorpay_order_id) {
                                        formData.append('razorpay_order_id', response.razorpay_order_id);
                                    }
                                    if (response.razorpay_signature) {
                                        formData.append('razorpay_signature', response.razorpay_signature);
                                    }
                                    
                                    // Use fetch API instead of form submission
                                    fetch('/api/payments', {
                                        method: 'POST',
                                        body: formData,
                                        headers: {
                                            'X-Requested-With': 'XMLHttpRequest'
                                        }
                                    })
                                    .then(function(response) {
                                        // Check if response is not redirecting
                                        if (response.redirected) {
                                            window.location.href = response.url;
                                            return;
                                        }
                                        return response.text();
                                    })
                                    .then(function(html) {
                                        try {
                                            // Try to parse as JSON first
                                            const jsonResponse = JSON.parse(html);
                                            console.log("Payment processed:", jsonResponse);
                                            
                                            if (jsonResponse.message === "Payment successful") {
                                                // Simply redirect to home page or any specific URL
                                                window.location.href = 'http://localhost:5174/reservations';  // Change this to your desired URL
                                            } else {
                                                // Show error
                                                document.documentElement.innerHTML = "<div class='container mt-5'><div class='alert alert-danger'>" + jsonResponse.message + "</div></div>";
                                            }
                                        } catch (e) {
                                            // If not JSON, treat as HTML
                                            document.documentElement.innerHTML = html;
                                        }
                                    })
                                    .catch(function(error) {
                                        console.error('Error:', error);
                                        // Show error message on the page
                                        document.getElementById('success-input').value = '';
                                        document.getElementById('error-input').value = 'Payment processing failed: ' + error.message;
                                        location.reload();
                                    });
                                 }
                              };
                              
                              // Create a Razorpay instance
                              var rzp = new Razorpay(options);
                              
                              // Render the payment button
                              document.getElementById('payment-button').onclick = function() {
                                 rzp.open();
                                 return false;
                              };
                           </script>
                           @endif
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </main>
      </div>
   </body>
</html>
