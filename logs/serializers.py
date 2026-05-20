from rest_framework import serializers
from .models import DriverLog, DutyEntry


class DutyEntrySerializer(serializers.ModelSerializer):
    # calculate duration automatically
    duration = serializers.SerializerMethodField()

    class Meta:
        model = DutyEntry
        fields = [
            'id',
            'duty_type', 
            'start_hour',
            'end_hour',
            'location_name',
            'duration'
        ]

    def get_duration(self, obj):
        return round(obj.end_hour - obj.start_hour, 2)


class DriverLogSerializer(serializers.ModelSerializer):
    
    duty_entries = DutyEntrySerializer(many=True, read_only=True)
    
    total_driving_hours = serializers.SerializerMethodField()
    total_off_duty_hours = serializers.SerializerMethodField()

    class Meta:
        model = DriverLog
        fields = [
            'id',
            'driver_name',
            'log_date',
            'miles_driven_today',
            'carrier_name',
            'office_address',
            'truck_number',
            'shipping_doc',
            'driver_remarks',
            'duty_entries',
            'total_driving_hours',
            'total_off_duty_hours',
            'created_at'
        ]

    def get_total_driving_hours(self, obj):
        driving = obj.duty_entries.filter(duty_type='driving')
        return round(sum(e.end_hour - e.start_hour for e in driving), 2)

    def get_total_off_duty_hours(self, obj):
        off_duty = obj.duty_entries.filter(duty_type='off_duty')
        return round(sum(e.end_hour - e.start_hour for e in off_duty), 2)