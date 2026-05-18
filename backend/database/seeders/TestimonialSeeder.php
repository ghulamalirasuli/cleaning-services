<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            [
                'author_name' => 'Sarah M.',
                'author_name_de' => 'Sarah M.',
                'body' => 'Absolutely fantastic service! The cleaner was punctual, thorough, and very professional. My apartment has never looked better.',
                'body_de' => 'Absolut fantastischer Service! Die Reinigungskraft war pünktlich, gründlich und sehr professionell. Meine Wohnung war noch nie so sauber.',
                'rating' => 5,
                'sort_order' => 0,
            ],
            [
                'author_name' => 'Thomas K.',
                'author_name_de' => 'Thomas K.',
                'body' => 'As an expat, finding an English-speaking cleaner was a lifesaver. The booking process was incredibly smooth.',
                'body_de' => 'Als Expat war eine englischsprachige Reinigungskraft eine Wohltat. Der Buchungsprozess war unglaublich reibungslos.',
                'rating' => 5,
                'sort_order' => 1,
            ],
            [
                'author_name' => 'Elena R.',
                'author_name_de' => 'Elena R.',
                'body' => 'I use the regular service weekly and it has been consistently excellent. The same cleaner every time knows exactly what I need.',
                'body_de' => 'Ich nutze den regelmäßigen Service wöchentlich — durchweg hervorragend. Immer dieselbe Reinigungskraft, die genau weiß, was ich brauche.',
                'rating' => 5,
                'sort_order' => 2,
            ],
            [
                'author_name' => 'Marcus W.',
                'author_name_de' => 'Marcus W.',
                'body' => 'Great deep cleaning service before our move-out. The landlord was impressed with the results.',
                'body_de' => 'Tolle Tiefenreinigung vor unserem Auszug. Der Vermieter war beeindruckt.',
                'rating' => 4,
                'sort_order' => 3,
            ],
        ];

        foreach ($rows as $row) {
            Testimonial::updateOrCreate(
                ['author_name' => $row['author_name'], 'body' => $row['body']],
                array_merge($row, ['is_active' => true])
            );
        }
    }
}
