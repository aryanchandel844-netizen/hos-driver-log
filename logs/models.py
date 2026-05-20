from django.db import models

class DriverLog(models.Model):
    
    driver_name = models.CharField(max_length=100)
    log_date = models.DateField()
    miles_driven_today = models.FloatField(default=0)
    
    carrier_name = models.CharField(max_length=100)
    office_address = models.CharField(max_length=200)
    truck_number = models.CharField(max_length=100)
    shipping_doc = models.CharField(max_length=100, blank=True, null=True)
    driver_remarks = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-log_date']
    
    def __str__(self):
        return f"Log: {self.driver_name} on {self.log_date}"


class DutyEntry(models.Model):
    DUTY_TYPES = [
        ('off_duty', 'Off Duty'),
        ('sleeper', 'Sleeper Berth'),
        ('driving', 'Driving'),
        ('on_duty_nd', 'On Duty - Not Driving'),
    ]
    
    driver_log = models.ForeignKey(
        DriverLog, 
        on_delete=models.CASCADE, 
        related_name='duty_entries'
    )
    duty_type = models.CharField(max_length=20, choices=DUTY_TYPES)
    start_hour = models.FloatField()  # 0-24 format
    end_hour = models.FloatField()    # 0-24 format
    location_name = models.CharField(max_length=200, blank=True)

    def duration(self):
        return self.end_hour - self.start_hour

    def __str__(self):
        return f"{self.duty_type} from {self.start_hour} to {self.end_hour}"