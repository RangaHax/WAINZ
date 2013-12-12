from django import template
from wainz.models import Image, ImageComment, Tag

register = template.Library()

@register.inclusion_tag('wainz/components/twitter.html')
def twitter_component(account):
    return { "twitter_account": account }

@register.inclusion_tag('wainz/components/image_list.html')
def image_list_component(images_and_votes, images_length):
    return { "images_and_votes": images_and_votes, "images_length":images_length }


def num_unapproved():
	images = Image.objects.order_by('-submission_date').filter(is_approved=False)[0:10000]
	num = images.count()
	if num == 0 :
		return ""
	return str(num)

register.assignment_tag(num_unapproved)

