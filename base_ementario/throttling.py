# -*- coding: utf-8 -*-
from rest_framework.throttling import SimpleRateThrottle, AnonRateThrottle

class APIKeyRateThrottle(SimpleRateThrottle):
    scope = 'api_key'

    def get_cache_key(self, request, view):
        authorization = request.META.get('HTTP_AUTHORIZATION')
        if authorization and authorization.startswith('Api-Key '):
            key = authorization.split()[1]
            return self.cache_format % {
                'scope': self.scope,
                'ident': key
            }
        return None

class CustomAnonRateThrottle(AnonRateThrottle):
    def get_cache_key(self, request, view):
        authorization = request.META.get('HTTP_AUTHORIZATION')
        if authorization and authorization.startswith('Api-Key '):
            return None
        return super().get_cache_key(request, view)
