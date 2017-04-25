#!/bin/perl
use strict;
use warnings;
use List::Util;
use POSIX qw/floor/;

  open(my $FILE, "<", "$ARGV[0]")
        or die "Can't open < input.txt: $!";
        my @list;
while( my $line = <$FILE>){
        if($line =~ m/$ARGV[2]/){
                if($line =~ m/,(\d+.\d+)/){
                push @list, $1;
                };
        }
}
close($FILE);
@list = sort {$a <=> $b} @list;
my $counter = floor($#list*$ARGV[1]);
print $list[$counter];
print "\n";
