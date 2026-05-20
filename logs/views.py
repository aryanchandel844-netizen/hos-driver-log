from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import DriverLog, DutyEntry
from .serializers import DriverLogSerializer, DutyEntrySerializer


class DriverLogViewSet(viewsets.ModelViewSet):
    queryset = DriverLog.objects.all()
    serializer_class = DriverLogSerializer

    def create(self, request):
        serializer = DriverLogSerializer(data=request.data)
        if serializer.is_valid():
            log = serializer.save()
            return Response(
                DriverLogSerializer(log).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_duty_entry(self, request, pk=None):
        log = self.get_object()
        data = request.data.copy()
        data['driver_log'] = log.id
        
        serializer = DutyEntrySerializer(data=data)
        if serializer.is_valid():
            serializer.save(driver_log=log)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def hos_summary(self, request, pk=None):
        log = self.get_object()
        entries = log.duty_entries.all()
        
        summary = {
            'driver': log.driver_name,
            'date': log.log_date,
            'total_miles': log.miles_driven_today,
            'hours_breakdown': {
                'driving': 0,
                'off_duty': 0,
                'sleeper': 0,
                'on_duty_nd': 0
            }
        }
        
        for entry in entries:
            hrs = entry.end_hour - entry.start_hour
            summary['hours_breakdown'][entry.duty_type] += round(hrs, 2)
        
        return Response(summary)


class DutyEntryViewSet(viewsets.ModelViewSet):
    queryset = DutyEntry.objects.all()
    serializer_class = DutyEntrySerializer
