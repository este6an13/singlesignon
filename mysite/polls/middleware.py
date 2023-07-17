from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from polls import models

def is_profile_complete(user):
    site = user.profile.site
    form = models.ProfileForm.objects.get(site=site)
    form_fields = form.form_fields['fields']

    required_fields = [field['id'] for field in form_fields if field['required']]

    select_fields = [ field for field in form_fields if field['type'] == 'select' ]

    options = {}

    for select_field in select_fields:
        choices = [ value[0] for value in select_field['choices'][1:] ]
        options[select_field['id']] = choices

    correct_values = all([ user.profile.dynamic_fields[k] in options[k] for k in options if k in user.profile.dynamic_fields.keys() ])
    print(correct_values)
    is_complete = all([field in user.profile.dynamic_fields for field in required_fields])
    return is_complete and correct_values

class ProfileRedirectionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        current_user = request.user
        skip_urls = [
            '/polls/myprofile',
            '/accounts/logout/',
        ]

        #print(is_profile_complete(current_user))

        if (
            current_user.is_authenticated
            and request.path not in skip_urls
            and not is_profile_complete(current_user)
        ):
            return HttpResponseRedirect(reverse_lazy("my_profile"))
